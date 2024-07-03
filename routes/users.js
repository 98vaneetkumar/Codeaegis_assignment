var express = require('express');
var router = express.Router();
const webSiteController=require("../controllers/webSiteController")
/* GET users listing. */


router.post("/url",webSiteController.scrapeData)
router.get("/getAllRecord",webSiteController.getAllRecord)
router.get("/getRecord/:id",webSiteController.getRecord)
router.delete("/deleteRecords",webSiteController.deleteRecord)
router.get("/downloadCSV",webSiteController.downloadCSV)

module.exports = router;
