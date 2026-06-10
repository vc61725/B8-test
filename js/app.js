
const SUPABASE_URL = "https://vfbxmednhbkcizyjojfc.supabase.co";
const SUPABASE_KEY = "sb_publishable_7ciuMdtTX-PyYVr3PbUGDQ_HGtC1wvp";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let b8Data = [];

window.onload = async function () {


document.getElementById("result").innerHTML =
    "正在載入商品主檔...";

try {

    const { data, error } = await db
        .from("products")
        .select("*");

    if (error) throw error;

    b8Data = data || [];

    document.getElementById("result").innerHTML =
        `
        <div>
            ✅ 商品主檔載入成功<br>
            共 ${b8Data.length} 筆資料
        </div>
        `;

    console.log("products =", b8Data);

} catch (error) {

    console.error(error);

    document.getElementById("result").innerHTML =
        `
        <div style="color:red">
            ❌ Supabase 商品主檔載入失敗
        </div>
        `;
}

};

function searchTDC() {
    const tdc = document.getElementById("tdcInput").value.trim();

    const item = b8Data.find(
        x => String(x.tdc).trim() === tdc
    );

    if (!item) {
        document.getElementById("result").innerHTML = "查無資料";
        return;
    }

    document.getElementById("result").innerHTML = `
    <b>TDC：</b>${item.tdc}<br>
    <b>全家代號：</b>${item.family_code}<br>
    <b>日翊代號：</b>${item.riyi_code}<br>
    <b>廠商：</b>${item.vendor_name}<br>
    <b>條碼：</b>${item.barcode}<br>
    <b>箱入數：</b>${item.carton_qty}
    `;
}

function downloadPDF() {
    html2pdf().from(document.getElementById("result")).save("B8入倉通知單.pdf");
}

async function convertCSV() {

    const file =
        document.getElementById("csvFile").files[0];

    if (!file) {

        alert("請選擇 CSV");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const decoder = new TextDecoder("big5");

        const csvText =
            decoder.decode(e.target.result);
console.log(csvText);
       const rows =
    csvText
    .split(/\r\n|\n|\r/)
    .filter(
        x => x.trim() !== ""
    );

       
       const headerIndex = rows.findIndex(
    row => row.includes("序號")
);

console.log("headerIndex =", headerIndex);

const dataRows =
    rows.slice(headerIndex + 1);

console.log(dataRows);

        let csvData = [];

        dataRows.forEach(row => {

            console.log(row);
            
            const cols =
                row.split(",");

            console.log(cols.length);
console.log(cols);

            console.log(cols.length, cols);

            if (cols.length < 18)
                return;

           csvData.push({

    productName: cols[2],

    tdc: cols[3],

    cartonQty: cols[7],

    center: cols[16],

    deliveryDate: cols[17]

});

console.log(csvData);

        });

        console.log(csvData);
let resultData = [];

let notFoundList = [];

csvData.forEach(item => {

    const product = b8Data.find(
        x => String(x.tdc).trim() === String(item.tdc).trim()
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

```
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
```

});

html += `

</table>
`;

if (notFoundList.length > 0) {

```
html += `
<hr>

<h3 style="color:red">
⚠ 找不到 Mapping 商品
</h3>
`;
```

}

document.getElementById("result").innerHTML =
html;


    };

    reader.readAsArrayBuffer(file);

}
