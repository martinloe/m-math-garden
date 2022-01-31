var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}

function predictImage() {
    // console.log('processing...');
    
    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY,0);
    cv.threshold(image,image,175,255,cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    // You can try more different parameters
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect);

    var height = image.rows;
    var width = image.cols;
    const longestSideSize = 20;
    var scalingFactor;
    var paddingX;
    var paddingY;

    if (height>width){
        scalingFactor = longestSideSize/height;
        height = 20;
        width = Math.round(width*scalingFactor);
    } else if (width>height) {
        scalingFactor = longestSideSize/width;
        height = Math.round(height*scalingFactor);
        width = 20;
    }

    let dsize = new cv.Size(width,height);
    cv.resize(image,image,dsize,0,0,cv.INTER_AREA)


    paddingXLeft = Math.ceil(4+(longestSideSize-width)/2);
    paddingXRight = Math.floor(4+(longestSideSize-width)/2);
    paddingYTop = Math.ceil(4+(longestSideSize-height)/2);
    paddingYBottom = Math.floor(4+(longestSideSize-height)/2);

    let borderColor = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(image, image, paddingYTop, paddingYBottom, paddingXLeft, paddingXRight, cv.BORDER_CONSTANT, borderColor);

    // Center of mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    let M = cv.moments(cnt, false);
    let cx = M.m10/M.m00;
    let cy = M.m01/M.m00;

    // console.log('Cx: ',cx,', Cy: ',cy);

    const xShift = Math.round(image.cols/2.0 - cx);
    const yShift = Math.round(image.rows/2.0 - cy);
    const transformationMatrix = cv.matFromArray(2,3,cv.CV_64FC1,[1,0,xShift,0,1,yShift]);
    newSize = new cv.Size(image.rows,image.height);

    cv.warpAffine(image,image,transformationMatrix,newSize,cv.INTER_LINEAR,cv.BORDER_CONSTANT,borderColor);
    
    let pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map(function(item){
        return item/255.0
    });
    // console.log(`pixel values: ${pixelValues}`);

    const X = tf.tensor([pixelValues]);
    // console.log(`Shape of tensor: ${X.shape}`);
    // console.log(`Data type of tensor: ${X.dtype}`);
    
    const Y_pred = model.predict(X);
    // Y_pred.print();
    // console.log(Y_pred.value);
    

    // console.log(tf.memory());
    
    const output = Y_pred.dataSync()[0];

    // Testing only (delete later)
    // const outputCanvas = document.createElement('CANVAS');
    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas);

    // Cleanup
    image.delete();
    cnt.delete();
    contours.delete();
    hierarchy.delete();
    transformationMatrix.delete();
    X.dispose();
    Y_pred.dispose();

    return output;

}