# class-automation
Using puppeteer, I have automated google classroom and google meet!

## Checklist
- [X] Getting links from particular subject in Google Classroom
- [X] Automating meet to signin using that link
- [X] Ending call when class ends
- [ ] Listening to attendance
- [ ] Updating chat if necessary (optional for me lol)

## Dependencies required:
1. puppeteer-extra
2. puppeteer-extra-plugin-stealth
3. yargs => This is optional if you want to use bat files.

Goto the scraper folder and run: npm i <module_name>

## Extra files needed:
credentials.json => Save this files in the scraper folder and store these things, as follows: 
```
{
    "mail" : "yourmail@ID",
    "password" : "Your password",
    "institute_mail": "Your institute mail id" 
}
```
Insitute email is optional if there is no institute mail id. I will provide with code changes to keep this intact.

## Follow this if there's no intitute mail provided.
In the scraper.js file comment out code from line number __82__ to __104__, and it should work fine. I hope so, xD!



# node code to run this thing
node scraper/scraper.js --url link-to-clasroom-subject \
Run this code from the class automation folder, or update the batch files.



# DISCLAIMER: 
## This is made for educational purposes only. Use of this code for unfair means is not my responsibility. Use it at your own risk!
