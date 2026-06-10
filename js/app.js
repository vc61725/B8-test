async function convertCSV() {


const file = document.getElementById("csvFile").files[0];

if (!file) {

    alert("請選擇 CSV");

    return;

}

document.getElementById("result").innerHTML =
    "載入中...";

const reader = new FileReader();

reader.onload = function (e) {

try {


    const decoder = new TextDecoder("big5");

    const csvText =
        decoder.decode(e.target.result);

    const rows = csvText
        .split(/\r\n|\n|\r/)
        .filter(
            x => x.trim() !== ""
        );

    // 找表頭
    const headerIndex = rows.findIndex(
        row => row.includes("序號")
    );

    const dataRows =
        rows.slice(headerIndex + 1);

    let csvData = [];

    dataRows.forEach(row => {

        const cols =
            row.split(",");

        if (cols.length < 18)
            return;

        csvData.push({

            productName: cols[2],

            tdc: cols[3],

            cartonQty: cols[7],

            center: cols[16],

            deliveryDate: cols[17]

        });

    });

    let resultData = [];

    let notFoundList = [];

    csvData.forEach(item => {

        const product = b8Data.find(
            x =>
                String(x.tdc).trim() ===
                String(item.tdc).trim()
        );

        if (!product) {

            notFoundList.push(item);

            return;

        }

        resultData.push({

            center: item.center,

            deliveryDate: item.deliveryDate,

            vendorName: product.vendor_name,

            tdc: item.tdc,

            productName: item.productName,

            cartonQty: item.cartonQty,

            riyiCode: product.riyi_code,

            barcode: product.barcode

        });

    });

    let html = `
    <h3>入倉通知單</h3>

    <table>

    <tr>
        <th>配送中心</th>
        <th>配送日期</th>
        <th>廠商</th>
        <th>TDC</th>
        <th>品名</th>
        <th>箱數</th>
        <th>日翊代號</th>
        <th>國際條碼</th>
    </tr>
    `;

    resultData.forEach(item => {

        html += `
        <tr>

            <td>${item.center}</td>

            <td>${item.deliveryDate}</td>

            <td>${item.vendorName}</td>

            <td>${item.tdc}</td>

            <td>${item.productName}</td>

            <td>${item.cartonQty}</td>

            <td>${item.riyiCode}</td>

            <td>${item.barcode}</td>

        </tr>
        `;

    });

    html += `
    </table>
    `;

    if (notFoundList.length > 0) {

        html += `
        <hr>

        <h3 style="color:red">
        ⚠ 找不到 Mapping 商品
        </h3>

        <table>

        <tr>

            <th>TDC</th>

            <th>品名</th>

            <th>箱數</th>

        </tr>
        `;

        notFoundList.forEach(item => {

            html += `
            <tr>

                <td>${item.tdc}</td>

                <td>${item.productName}</td>

                <td>${item.cartonQty}</td>

            </tr>
            `;

        });

        html += `
        </table>
        `;

    }

    document.getElementById("result").innerHTML =
        html;

} catch (error) {

    console.error(error);

    document.getElementById("result").innerHTML =
        `
        <div style="color:red">
        ❌ 發生錯誤
        <br><br>
        ${error}
        </div>
        `;

}


};

reader.readAsArrayBuffer(file);


}
