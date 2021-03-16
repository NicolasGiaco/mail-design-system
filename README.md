# Mail Design System


## How to use

First, modify the `config.js` to use your Mailjet credentials

Once, it's done, you can push to the main branch and the CI will run
When this one is done, log in your Mailjet account, and go to `https://app.mailjet.com/templates/transactional`
You should see 3 translated templates, click on "Preview and history" to view your template

NOTE: You can't for now "edit" the template. Strangely, Mailjet crashes when you try to. This will be fixed soon !


If you want to run the script manually, you can by using the command

`node main.js`

Make sure you have node installed !


## Personal feeling

I really enjoyed this test! It was really interesting to work on MJML, something I couldn't do before.


## This is how I went about solving this test

I first looked at how workflows worked on Github to know how I was going to set up my solution.
Then, I looked at how to use mailjet and how the MJML format worked.
I then used the mailjet API on POSTMAN to understand how it worked.
I then implemented Javascript, first by just removing the `mj-text` tags, and then trying to translate


## Result :

Project is working when you're running it the first time


## Problems : 

Problem are :
    - If a template with the same name already exist in Mailjet
    - If there is html in the sentence, example : `Simply created&nbsp;on&nbsp;<a style="color:#ffffff" href="http://www.mailjet.com"><b>Mailjet Passport</b></a>`


## What I would have liked to do better

I would have liked :
    - Put in place a **cleaner code** and **better logic**, It can be greatly improved, I rushed a bit when I felt that time was running out
    - Better file architecture

Thank you for this test! 
