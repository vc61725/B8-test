const SUPABASE_URL =
"https://vfbxmednhbkcizyjojfc.supabase.co";

const SUPABASE_KEY =
"sb_publishable_7ciuMdtTX-PyYVr3PbUGDQ_HGtC1wvp";

const db =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.b8Data = [];

window.onload = async function () {

    document.getElementById("result").innerHTML =
        "正在載入商品主檔...";

    try {

        const { data, error } = await db
            .from("products")
            .select("*");

        if (error)
            throw error;

        window.b8Data = data || [];

        document.getElementById("result").innerHTML =
            `
            ✅ 商品主檔載入成功
            <br>
            共 ${window.b8Data.length} 筆資料
            `;

    }

    catch (error) {

        console.error(error);

        document.getElementById("result").innerHTML =
            `
            <span style="color:red">
            商品主檔載入失敗
            </span>
            `;

    }

};


function searchTDC() {

    const tdc =
        document
        .getElementById("tdcInput")
        .value
        .trim();

    const item =
        window.b8Data.find(
            x =>
                String(x.tdc).trim()
                ===
                tdc
        );

    if (!item) {

        document.getElementById("result").innerHTML =
            "查無資料";

        return;

    }

    document.getElementById("result").innerHTML =
        `
        <b>TDC：</b>${item.tdc}
        <br>
        <b>全家代號：</b>${item.family_code}
        <br>
        <b>日翊代號：</b>${item.riyi_code}
        <br>
        <b>廠商：</b>${item.vendor_name}
        <br>
        <b>國際條碼：</b>${item.barcode}
        <br>
        <b>箱入數：</b>${item.carton_qty}
        `;

}



async function convertCSV() {

    const file =
        document
        .getElementById("csvFile")
        .files[0];

    if (!file) {

        alert("請選擇 CSV");

        return;

    }

    document.getElementById("result").innerHTML =
        "讀取 CSV 中...";

    const reader =
        new FileReader();

    reader.onload = function (e) {

        const decoder =
            new TextDecoder("big5");

        const csvText =
            decoder.decode(
                e.target.result
            );

        const rows =
            csvText
            .split(/\r\n|\n|\r/)
            .filter(
                x => x.trim() !== ""
            );

        const headerIndex =
            rows.findIndex(
                row =>
                    row.includes("序號")
            );

        const dataRows =
            rows.slice(
                headerIndex + 1
            );

        let csvData = [];

        dataRows.forEach(row => {

            const cols =
                row.split(",");

            if (cols.length < 18)
                return;

            csvData.push({

                productName:
                    cols[2],

                tdc:
                    cols[3],

                cartonQty:
                    cols[7],

                center:
                    cols[16],

                deliveryDate:
                    cols[17]

            });

        });

let resultData = [];

let notFoundList = [];

let totalCartonQty = 0;

let totalPCS = 0;
        
csvData.forEach(item => {

    const product =
        window.b8Data.find(
            x =>
                String(x.tdc).trim()
                ===
                String(item.tdc).trim()
        );

    if (!product) {

        notFoundList.push(item);

        return;

    }

  
resultData.push({

    center:
        item.center,

    deliveryDate:
        item.deliveryDate,

    vendorName:
        product.vendor_name,

    tdc:
        item.tdc,

    productName:
        item.productName,

    cartonQty:
        item.cartonQty,

    riyiCode:
        product.riyi_code,

    barcode:
        product.barcode,

    cartonSize:
        product.carton_qty

});

totalCartonQty +=
    Number(item.cartonQty);

totalPCS +=
    Number(item.cartonQty)
    *
    Number(product.carton_qty);

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

<br>

<b>
共 ${resultData.length} 筆商品
</b>

<br><br>

<b>
總箱數：
${totalCartonQty}
箱
</b>

<br><br>

<b>
總 PCS 數：

${totalPCS}

PCS
</b>
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

    html += `</table>`;

}

document.getElementById("result").innerHTML =
    html;

        

    };

    reader.readAsArrayBuffer(file);

}






function downloadPDF() {

    html2pdf()

        .from(
            document.getElementById("result")
        )

        .save(
            "B8入倉通知單.pdf"
        );

}
