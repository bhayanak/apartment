import express from 'express'
import data from './data/Apartment.json'
import csvdata from './data/csvjson.json'
import { PDFDocumentFactory, PDFDocumentWriter, StandardFonts, drawText, drawImage } from 'pdf-lib'
import fs from 'fs'
import sha265sum from 'sha256-file'
import csv2json from 'convert-csv-to-json'
import json5 from 'json5'

const app = express()
const PORT = 3000

app.use(express.static('public'))
app.use('/images', express.static('images'))

app.get('/', (req, res) => {
	res.json(data)
})

app.get('/:flat', (req, res) => {
	let flatNo = Number(req.params.flat)
	res.send(data[toArrIndex(flatNo)])
	EditPdf(flatNo.toString())
})

function EditPdf(details) {
	const assets = {
		existingPdfDocBytes: fs.readFileSync('./data/data.pdf'),
		//signJpgBytes: fs.readFileSync('./images/sign.jpg'),
	};

	const pdfDoc = PDFDocumentFactory.load(assets.existingPdfDocBytes);
	const [helveticaRef, helveticaFont] = pdfDoc.embedStandardFont(
		StandardFonts.Helvetica,
	);

	//const [unicornJpgRef, unicornJpgDims] = pdfDoc.embedJPG(assets.signJpgBytes)
	//const UNICORN_JPG_WIDTH = unicornJpgDims.width * 0.2;
	//const UNICORN_JPG_HEIGHT = unicornJpgDims.height * 0.2;

	const pages = pdfDoc.getPages();
	const page = pages[0];
	page.addFontDictionary('Helvetica', helveticaRef)
	//.addImageObject('sign', unicornJpgRef);
	for (const [k, v] of details) {
		console.log(k, v)
	}
	const contentStream = pdfDoc.createContentStream(
		drawText(helveticaFont.encodeText(details.get('receiptno').toString()), {
			x: 200,
			y: 480,
			size: 20,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('flat').toString()), {
			x: 160,
			y: 440,
			size: 20,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('dateof').toString()), {
			x: 740,
			y: 440,
			size: 20,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('name').toString()), {
			x: 250,
			y: 390,
			size: 20,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('amount').toString()), {
			x: 730,
			y: 390,
			size: 26,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('amountwords').toString()), {
			x: 310,
			y: 340,
			size: 20,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('monthof').toString()), {
			x: 310,
			y: 290,
			size: 20,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('cash').toString()), {
			x: 75,
			y: 230,
			size: 20,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		drawText(helveticaFont.encodeText(details.get('imps').toString()), {
			x: 330,
			y: 200,
			size: 30,
			font: 'Helvetica',
			colorRgb: [0, 0, 1],
		}),
		/*drawImage('sign', {
			x: 770,
			y: 170,
		}),*/
	);

	page.addContentStreams(pdfDoc.register(contentStream));
	const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
	const filePath = `${__dirname}/receipts/${details.get('flat').toString()}.pdf`;
	fs.writeFileSync(filePath, pdfBytes);
	sha265sum(filePath)
	console.log(`PDF file written to: ${filePath} with ${pdfBytes.length} sha256sum: ${sha265sum(filePath)}`);
}

function getDetails(receipt, flat, dateof, name, amount, amountwords, monthof, cash, imps, remarks) {
	const m = new Map()
	m.set('receiptno', receipt)
	m.set('flat', flat)
	m.set('dateof', dateof)
	m.set('name', name)
	m.set('amount', amount + '/-')
	m.set('amountwords', amountwords + ' only')
	m.set('monthof', monthof)
	m.set('cash', cash)
	m.set('imps', imps)
	m.set('remarks', remarks)
	return m;
}

function getPdfs() {
	var row
	var receipt = 1
	for (row of csvdata) {
		var line = json5.parse(json5.stringify(row))
		const paid = line["Paid"]
		if (paid == "Yes") {
			const flat = line["Flat No"]
			const dateof = line["Paid On"]
			const name = line["Name"]
			const amount = line["Amount Paid"]

			var monthof = line["monthof"]
			console.log(`We found month value before: ${monthof}`)
			if (ifEmpty(monthof)) {
				monthof = getMonth(new Date())
				console.log(`We found month value after: ${monthof}`)
			}

			var cash = line["cash"]

			if (ifEmpty(cash)) {
				cash = ""
			}
			else {
				cash = "/"
				console.log(`Cash value is : ${cash}`)
			}

			const imps = line["bank"]
			const remarks = line["remarks"]
			console.log(`Generating pdf for ${flat}, ${dateof}, ${name} , ${amount} , ${monthof} , ${cash} , ${imps}`)
			const dataMap = getDetails(receipt, flat, dateof, name, amount, convertNumberToWords(amount + ""), monthof, cash, imps, remarks)
			EditPdf(dataMap)
			console.log('Generated suuceefully')
			receipt++
		}
	}
}

function getMonth(date) {
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return months[date.getMonth()]
}

function ifEmpty(value) {
	var result = false
	if (typeof value == 'undefined' || value == "" || value == null || value.length <= 0)
		result = true
	return result
}

function convertNumberToWords(amount) {
	var words = new Array();
	words[0] = '';
	words[1] = 'One';
	words[2] = 'Two';
	words[3] = 'Three';
	words[4] = 'Four';
	words[5] = 'Five';
	words[6] = 'Six';
	words[7] = 'Seven';
	words[8] = 'Eight';
	words[9] = 'Nine';
	words[10] = 'Ten';
	words[11] = 'Eleven';
	words[12] = 'Twelve';
	words[13] = 'Thirteen';
	words[14] = 'Fourteen';
	words[15] = 'Fifteen';
	words[16] = 'Sixteen';
	words[17] = 'Seventeen';
	words[18] = 'Eighteen';
	words[19] = 'Nineteen';
	words[20] = 'Twenty';
	words[30] = 'Thirty';
	words[40] = 'Forty';
	words[50] = 'Fifty';
	words[60] = 'Sixty';
	words[70] = 'Seventy';
	words[80] = 'Eighty';
	words[90] = 'Ninety';
	amount = amount.toString();
	var atemp = amount.split(".");
	var number = atemp[0].split(",").join("");
	var n_length = number.length;
	var words_string = "";
	var value = "";
	if (n_length <= 9) {
		var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
		var received_n_array = new Array();
		for (var i = 0; i < n_length; i++) {
			received_n_array[i] = number.substr(i, 1);
		}
		for (var i = 9 - n_length, j = 0; i < 9; i++ , j++) {
			n_array[i] = received_n_array[j];
		}
		for (var i = 0, j = 1; i < 9; i++ , j++) {
			if (i == 0 || i == 2 || i == 4 || i == 7) {
				if (n_array[i] == 1) {
					n_array[j] = 10 + parseInt(n_array[j]);
					n_array[i] = 0;
				}
			}
		}
		for (var i = 0; i < 9; i++) {
			if (i == 0 || i == 2 || i == 4 || i == 7) {
				value = n_array[i] * 10;
			} else {
				value = n_array[i];
			}
			if (value != 0) {
				words_string += words[value] + " ";
			}
			if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
				words_string += "Thousand ";
			}
			if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
				words_string += "Hundred and ";
			} else if (i == 6 && value != 0) {
				words_string += "Hundred ";
			}
		}
		words_string = words_string.split("  ").join(" ");
	}
	return words_string;
}

function toArrIndex(f) {
	switch (Math.trunc(f / 100)) {
		case 1:
			return (f % 100) - 1;
			break;
		case 2:
			return 10 + (f % 200);
			break;
		case 3:
			return 21 + (f % 300);
			break;
		case 4:
			return 32 + (f % 400);
			break;
		case 5:
			return 43 + (f % 500);
			break;
		default:
			return 0;
	}
}


app.post('/generateall', (req, res) => {
	getPdfs()
	res.send(`Post Request with /netItem Route on Port ${PORT} on , ${new Date()}`)
})

app.put('/item', (req, res) => {
	getPdfs()
	res.send(`Put Request with /item Route on Port ${PORT}`)
})


app.delete('/item', (req, res) => {
	res.send(`Delete Request with /item Route on Port ${PORT}`)
})

app.listen(PORT, () => {
	console.log(`Running on ${PORT}`)
})