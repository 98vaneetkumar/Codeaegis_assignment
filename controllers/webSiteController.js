const axios = require("axios");
const cheerio = require("cheerio");
const { createObjectCsvStringifier } = require('csv-writer');
const path=require("path")
const fs=require("fs")
const Model=require("../models/index")
module.exports={
    scrapeData:async(req,res)=>{
        try {
            let { url } = req.body;
            if (!url) {
                return res.status(400).send("URL is required.");
            }
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const name = $('meta[property="og:site_name"]').attr('content') || $("title").text();
            const description = $('meta[name="description"]').attr('content');
            const logo = $('meta[property="og:image"]').attr('content');
            const facebookUrl = $('a[href*="facebook.com"]').attr('href');
            const linkedInUrl = $('a[href*="linkedin.com"]').attr('href');
            const twitterUrl = $('a[href*="twitter.com"]').attr('href');
            const intstagramUrl = $('a[href*="instagram.com"]').attr('href');
            const address = $('address').text();
            const phoneNumber = $('a[href^="tel:"]').text();
            const email = $('a[href^="mailto:"]').text();
    
            const result = {
                name: name,
                description: description?description:"",
                companyLogo: logo,
                facebookUrl: facebookUrl,
                linkedInUrl: linkedInUrl,
                twitterUrl: twitterUrl?twitterUrl:"",
                intstagramUrl: intstagramUrl,
                address: address,
                phoneNumber: phoneNumber,
                email: email,
            };
           
            Model.webSiteRecord.create(result)
            res.status(200).send({ message: "Data Stroed successfully!", data: result });
        } catch (error) {
            console.error("Error fetching the URL:", error.message);
            res.status(500).send("An error occurred while fetching the data.");
        }
    },
    getAllRecord:async(req,res)=>{
        try {
         let response=await Model.webSiteRecord.findAll(); 
         res.status(200).send({ message: "Data fetched successfully!", data: response });
        } catch (error) {
            console.error("Error fetching the URL:", error.message);
            res.status(500).send("An error occurred while fetching the data.");        }
    },
    getRecord:async(req,res)=>{
        try {
            let {id}=req.params
            let response=await Model.webSiteRecord.findOne({where:{id:id}});
            res.status(200).send({ message: 'Records fetch successfully.',response:response});    
        } catch (error) {
            console.error("Error fetching the URL:", error.message);
            res.status(500).send("An error occurred while fetching the data.");
        }
    },
    deleteRecord:async(req,res)=>{
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).send({ message: 'Invalid request, no Ids provided.' });
            }
            const result = await Model.webSiteRecord.destroy({
                where: {
                    id: ids
                }
            });
    
            if (result === 0) {
                return res.status(404).send({ message: 'No records found to delete.' });
            }
    
            res.status(200).send({ message: 'Records deleted successfully.'});    
        } catch (error) {
            console.error("Error fetching the URL:", error.message);
            res.status(500).send("An error occurred while fetching the data.");
        }
    },
    downloadCSV:async(req,res)=>{
        try {
            const records = await Model.webSiteRecord.findAll();
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'Id' },
                    { id: 'description', title: 'Description' },
                    { id: 'logo', title: 'Logo' },
                    { id: 'facebookUrl', title: 'Facebook URL' },
                    { id: 'linkedInUrl', title: 'LinkedIn URL' },
                    { id: 'twitterUrl', title: 'Twitter URL' },
                    { id: 'intstagramUrl', title: 'Instagram URL' },
                    { id: 'address', title: 'Address' },
                    { id: 'phoneNumber', title: 'Phone Number' },
                    { id: 'email', title: 'Email' },
                    { id: 'createdAt', title: 'Created At' }
                ]
            });
            const plainRecords = records.map(record => record.get({ plain: true }));
            const header = csvStringifier.getHeaderString();
            const recordsCSV = csvStringifier.stringifyRecords(plainRecords);
            const csvContent = header + recordsCSV;
            const filePath = path.join(__dirname, '../public/records.csv');
            fs.writeFileSync(filePath, csvContent);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=records.csv');       
            res.download(filePath, 'records.csv', (err) => {
                if (err) {
                    console.error("Error sending the file:", err.message);
                    res.status(500).send("An error occurred while sending the file.");
                } else {
                    console.log("File sent successfully.");
                }
            });
        } catch (error) {
            console.error('Error fetching records:', error);
            res.status(500).send({ message: 'Error fetching records.', error: error.message });
        }
    }
}