let cameras = [];
let sensors = [];
let apertures = [];
let settings = [];


// JSON読み込み
async function loadJson(file) {

    const response = await fetch(file);

    return await response.json();

}


// 初期化
async function init() {

    cameras = await loadJson("data/cameras.json");
    sensors = await loadJson("data/sensors.json");
    apertures = await loadJson("data/apertures.json");
    settings = await loadJson("data/settings.json");


    createCameraList();
    createSensorList();
    createApertureList();


    // 赤緯初期値
    document.getElementById("declination").value =
        settings.defaults.declination;

}


// カメラ一覧
function createCameraList() {

    const select =
        document.getElementById("camera");


    cameras.forEach(camera => {

        const option =
            document.createElement("option");

        option.value = camera.id;
        option.textContent = camera.name;

        select.appendChild(option);

    });

}


// センサー一覧
function createSensorList() {

    const select =
        document.getElementById("sensor");


    sensors.forEach(sensor => {

        const option =
            document.createElement("option");

        option.value = sensor.id;
        option.textContent = sensor.name;

        select.appendChild(option);

    });

}


// F値一覧
function createApertureList() {

    const select =
        document.getElementById("aperture");


    apertures.forEach(aperture => {

        const option =
            document.createElement("option");

        option.value = aperture.value;
        option.textContent = aperture.name;

        select.appendChild(option);

    });

}



// カメラ変更
document
.getElementById("camera")
.addEventListener(
"change",
function(){


    const camera =
        cameras.find(
            c => c.id === this.value
        );


    const sensorSelect =
        document.getElementById("sensor");


    const pixels =
        document.getElementById("pixels");



    // カスタム
    if(camera.id === "custom"){


        sensorSelect.disabled = false;

        pixels.readOnly = false;


        sensorSelect.selectedIndex = 0;

        pixels.value = "";


    }
    else{


        const sensor =
            sensors.find(
                s =>
                s.id === camera.sensor_id
            );


        sensorSelect.value =
            sensor.id;


        pixels.value =
            camera.pixels_x;


        sensorSelect.disabled = true;

        pixels.readOnly = true;

    }


});




// NPF計算
function calculateNPF(){


    const camera =
        cameras.find(
            c =>
            c.id ===
            document.getElementById("camera").value
        );



    if(!camera){

        alert("カメラを選択してください");

        return;

    }



    const sensorId =
        document.getElementById("sensor").value;



    const sensor =
        sensors.find(
            s =>
            s.id === sensorId
        );



    const pixels =
        Number(
            document.getElementById("pixels").value
        );



    const focal =
        Number(
            document.getElementById("focal").value
        );



    const declination =
        Number(
            document.getElementById("declination").value
        );



    if(!pixels || !focal){

        alert("必要な値を入力してください");

        return;

    }



    // 画素ピッチ μm
    const pixelPitch =
        sensor.width_mm
        /
        pixels
        *
        1000;



    // 赤緯補正
    const dec =
        declination *
        Math.PI /
        180;



    const aperture =
    Number(
        document.getElementById("aperture").value
    );


    // NPFルール
    const c1 = settings.npf.constant_1; // 35
    const c2 = settings.npf.constant_2; // 30
    const shutter =
        (c1 + c2) * pixelPitch
        / (focal * aperture * Math.cos(dec));



    document
    .getElementById("result")
    .textContent =
        shutter.toFixed(1)
        +
        "秒";


}



// 計算ボタン
document
.getElementById("calculate")
.addEventListener(
    "click",
    calculateNPF
);



// 起動
init();