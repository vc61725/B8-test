const SUPABASE_URL =
"https://vfbxmednhbkcizyjojfc.supabase.co";

const SUPABASE_KEY =
"你的 publishable key";

const db =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

let b8Data = [];

window.onload = async function () {


try {

    const { data, error } =
        await db
            .from("products")
            .select("*");

    if (error) throw error;

    b8Data = data;

    document.getElementById("result").innerHTML =
        `成功載入 ${b8Data.length} 筆商品資料`;

}
catch (error) {

    console.error(error);

    document.getElementById("result").innerHTML =
        "Supabase資料載入失敗";

}
```

};

function searchTDC() {

```
const tdc =
    document
        .getElementById("tdcInput")
        .value
        .trim();

const item =
    b8Data.find(
        x =>
            String(x.tdc).trim()
            === tdc
    );

if (!item) {

    document.getElementById("result").innerHTML =
        "查無資料";

    return;

}

document.getElementById("result").innerHTML =

    `
    <b>TDC：</b>${item.tdc}<br>
    <b>全家代號：</b>${item.family_code}<br>
    <b>日翊代號：</b>${item.riyi_code}<br>
    <b>期數：</b>${item.period}<br>
    <b>廠商：</b>${item.vendor_name}<br>
    <b>廠商代號：</b>${item.vendor_code}<br>
    <b>Email：</b>${item.vendor_email}<br>
    <b>條碼：</b>${item.barcode}<br>
    <b>箱入數：</b>${item.carton_qty}
    `;
```

}

function convertCSV() {

```
const file =
    document
        .getElementById("csvFile")
        .files[0];

if (!file) {

    alert("請先選擇CSV");

    return;

}

const reader =
    new FileReader();

reader.onload = function (e) {

    const text =
        e.target.result;

    const lines =
        text.split(/\r?\n/);

    let startIndex = -1;

    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        if (
            lines[i].includes("序號")
            &&
            lines[i].includes("品代")
        ) {

            startIndex = i + 1;

            break;

        }

    }

    if (startIndex === -1) {

        document.getElementById("result").innerHTML =
            "找不到資料區";

        return;

    }

    let vendorGroups = {};

    for (
        let i = startIndex;
        i < lines.length;
        i++
    ) {

        if (
            lines[i].trim() === ""
        ) continue;

        const cols =
            lines[i].split(",");

        if (
            cols.length < 9
        ) continue;


        const productName =
            cols[2]
                .replace(/"/g, "")
                .trim();

        const tdc =
            cols[3]
                .replace(/"/g, "")
                .trim();

        const boxQty =
            cols[7]
                .replace(/"/g, "")
                .trim();

        const totalQty =
            cols[8]
                .replace(/"/g, "")
                .trim();


        const item =
            b8Data.find(
                x =>
                    String(x.tdc).trim()
                    === tdc
            );

        if (!item)
            continue;


        if (
            !vendorGroups[item.vendor_code]
        ) {

            vendorGroups[item.vendor_code] = {

                vendor_name:
                    item.vendor_name,

                vendor_email:
                    item.vendor_email,

                items: []

            };

        }


        vendorGroups[item.vendor_code]
            .items
            .push({

                productName,
                tdc,
                boxQty,
                totalQty,
                riyi_code:
                    item.riyi_code,

                carton_qty:
                    item.carton_qty

            });

    }


    let resultHtml = "";

    for (
        const vendorCode
        in vendorGroups
    ) {

        const vendor =
            vendorGroups[vendorCode];

        resultHtml +=

            `
            <h2>
                ${vendor.vendor_name}
            </h2>

            <hr>
            `;


        vendor.items.forEach(
            product => {

                resultHtml +=

                    `
                    品名：
                    ${product.productName}
                    <br>

                    TDC：
                    ${product.tdc}
                    <br>

                    日翊代號：
                    ${product.riyi_code}
                    <br>

                    箱入數：
                    ${product.carton_qty}
                    <br>

                    訂購箱數：
                    ${product.boxQty}
                    <br>

                    訂購總數：
                    ${product.totalQty}
                    <br>

                    <hr>
                    `;

            });

    }

    document.getElementById("result").innerHTML =
        resultHtml;

};

reader.readAsText(
    file,
    "utf-8"
);


}

