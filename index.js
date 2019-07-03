import express from 'express'
import data from './data/Apartment.json'
import csvdata from './data/csvjson.json'
import { PDFDocumentFactory, PDFDocumentWriter, StandardFonts, drawText, drawImage } from 'pdf-lib'
import fs from 'fs'
import sha265sum from 'sha256-file'
import json5 from 'json5'
import path from 'path'

const app = express()
const PORT = 3000

app.use(express.static('public'))
app.use('/images', express.static('images'))

var j

var jsonHashes = {
	"101": {
		"filename": "",
		"sha256sum": ""
	},
	"102": {
		"filename": "",
		"sha256sum": ""
	},
	"103": {
		"filename": "",
		"sha256sum": ""
	},
	"104": {
		"filename": "",
		"sha256sum": ""
	},
	"105": {
		"filename": "",
		"sha256sum": ""
	},
	"106": {
		"filename": "",
		"sha256sum": ""
	},
	"107": {
		"filename": "",
		"sha256sum": ""
	},
	"108": {
		"filename": "",
		"sha256sum": ""
	},
	"109": {
		"filename": "",
		"sha256sum": ""
	},
	"110": {
		"filename": "",
		"sha256sum": ""
	},
	"111": {
		"filename": "",
		"sha256sum": ""
	},
	"201": {
		"filename": "",
		"sha256sum": ""
	},
	"202": {
		"filename": "",
		"sha256sum": ""
	},
	"203": {
		"filename": "",
		"sha256sum": ""
	},
	"204": {
		"filename": "",
		"sha256sum": ""
	},
	"205": {
		"filename": "",
		"sha256sum": ""
	},
	"206": {
		"filename": "",
		"sha256sum": ""
	},
	"207": {
		"filename": "",
		"sha256sum": ""
	},
	"208": {
		"filename": "",
		"sha256sum": ""
	},
	"209": {
		"filename": "",
		"sha256sum": ""
	},
	"210": {
		"filename": "",
		"sha256sum": ""
	},
	"211": {
		"filename": "",
		"sha256sum": ""
	},
	"301": {
		"filename": "",
		"sha256sum": ""
	},
	"302": {
		"filename": "",
		"sha256sum": ""
	},
	"303": {
		"filename": "",
		"sha256sum": ""
	},
	"304": {
		"filename": "",
		"sha256sum": ""
	},
	"305": {
		"filename": "",
		"sha256sum": ""
	},
	"306": {
		"filename": "",
		"sha256sum": ""
	},
	"307": {
		"filename": "",
		"sha256sum": ""
	},
	"308": {
		"filename": "",
		"sha256sum": ""
	},
	"309": {
		"filename": "",
		"sha256sum": ""
	},
	"310": {
		"filename": "",
		"sha256sum": ""
	},
	"311": {
		"filename": "",
		"sha256sum": ""
	},
	"401": {
		"filename": "",
		"sha256sum": ""
	},
	"402": {
		"filename": "",
		"sha256sum": ""
	},
	"403": {
		"filename": "",
		"sha256sum": ""
	},
	"404": {
		"filename": "",
		"sha256sum": ""
	},
	"405": {
		"filename": "",
		"sha256sum": ""
	},
	"406": {
		"filename": "",
		"sha256sum": ""
	},
	"407": {
		"filename": "",
		"sha256sum": ""
	},
	"408": {
		"filename": "",
		"sha256sum": ""
	},
	"409": {
		"filename": "",
		"sha256sum": ""
	},
	"410": {
		"filename": "",
		"sha256sum": ""
	},
	"411": {
		"filename": "",
		"sha256sum": ""
	},
	"501": {
		"filename": "",
		"sha256sum": ""
	},
	"502": {
		"filename": "",
		"sha256sum": ""
	},
	"503": {
		"filename": "",
		"sha256sum": ""
	},
	"504": {
		"filename": "",
		"sha256sum": ""
	},
	"505": {
		"filename": "",
		"sha256sum": ""
	},
	"506": {
		"filename": "",
		"sha256sum": ""
	},
	"507": {
		"filename": "",
		"sha256sum": ""
	},
	"508": {
		"filename": "",
		"sha256sum": ""
	},
	"509": {
		"filename": "",
		"sha256sum": ""
	},
	"510": {
		"filename": "",
		"sha256sum": ""
	},
	"511": {
		"filename": "",
		"sha256sum": ""
	}
}
const monthJsonFile = `./data/${getMonthYear()}.json`
fs.access(monthJsonFile, fs.F_OK, (err) => {
	if (err) {
		console.error(err)
		createMonthJson()
		return
	}
})

function createMonthJson() {
	fs.writeFile(monthJsonFile, json5.stringify(jsonHashes, null, 4), 'utf8', (err) => {
		if (err) {
			console.error(err)
			return
		}
		console.log("File" + monthJsonFile + " has been created");
	})
}

app.get('/', (req, res) => {
	res.json(data)
})

app.get('/:flat', (req, res) => {
	let flatNo = Number(req.params.flat)
	res.send(data[toArrIndex(flatNo)])
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
			size: 25,
			font: 'Helvetica',
			colorRgb: [1, 0, 0],
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
			size: 20,
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
	const filePath = `${__dirname}/receipts/${details.get('flat')}_${details.get('monthof')}.pdf`;
	fs.writeFileSync(filePath, pdfBytes);
	sha265sum(filePath)
	// write sha256sum to json
	addToMonthJson(details.get('flat').toString(), filePath, sha265sum(filePath))
	console.log(`PDF file written to: ${filePath} with ${pdfBytes.length} sha256sum: ${sha265sum(filePath)}`);
}

function addToMonthJson(flat, filePath, sha256sum) {
	jsonHashes[flat]["filename"] = path.parse(filePath).base
	jsonHashes[flat]["sha256sum"] = sha256sum
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
	var receipt = 0
	for (row of csvdata) {
		console.log(json5.stringify(row))
		var line = json5.parse(json5.stringify(row))
		const paid = line["Paid"]
		if (paid == "Yes") {
			const flat = line["Flat No"]
			const receipt = toArrIndex(flat) + 1
			const dateof = line["Paid On"]
			const name = line["Name"]
			const amount = line["Amount Paid"]

			var monthof = line["monthof"]
			console.log(`We found month value before: ${monthof}`)
			if (ifEmpty(monthof)) {
				monthof = getMonthYear()
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
		}
	}
	//Lets write json now
	fs.writeFileSync(monthJsonFile, json5.stringify(jsonHashes, null, 4));
}

function getMonthYear() {
	return `${getMonth(new Date())}-${new Date().getFullYear()}`
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

app.delete('/item', (req, res) => {
	res.send(`Delete Request with /item Route on Port ${PORT}`)
})

app.listen(PORT, () => {
	console.log(`Running on ${PORT}`)
})