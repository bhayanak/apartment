# Apartment

This project contains file to generate pdf receipts of apartment members.

Prerequisite:
* Node js with npm installed.
* Download dependency bu running _**npm i**_
* Create json with data for apartments
  * format is attached as excel sheet in *data* folder, fill data.
    * **cash:** if amount is paid through cash.
    * **bank:** If amount paid through bank transfer, fill neft/imps/upi id here.   
  * save file as csv
  * convert it to json from [csv2json](https://www.csvjson.com/csv2json)
  * Download this json file and place it to data folder.
* Good to start now.

How to run:
1. run project with command:
    _**npm start**_
1. run post call on below url using postman or any rest client:
    _**http://localhost:3000/generateall**_
3. Check if post returns success and pdfs are generated in _**receipts**_ folder
4. Hashes(sha256sum) will be also generated with flat-numbers and pdf filenames in _**data**_ folder. This file is used when someone else generates PDF or tries to forge/edit PDF.

:smile: :smile:
