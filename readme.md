# Hi!

![screenshot](https://raw.github.com/jlord/hack-spots/gh-pages/img/hackspotsss.png)

This is the code for a website that shows the spots myself, my friends (or Twitter friends) have found to be excelent hacking spots around the whole wide world.

### Fork -n- Go!

In a bit I'll do some more refining (and documentation) - but here's a fun fact:

This repo only has a **gh-pages** branch, which means as soon as you **fork** it, you have a hosted and live version of it yourself! 

Next, create a spreadsheet with the same column headers as [the original](https://docs.google.com/spreadsheet/ccc?key=0Ao5u1U6KYND7dFVkcnJRNUtHWUNKamxoRGg4ZzNiT3c#gid=0).

Click on the `index.html` file, click edit and change **line 107**. Replace the existing spreadsheet URL key with your spreadsheet's key. You'll find that by clicking (in Google Spreadsheets) File > Publish to the Web > Start Publishing, it will then display the key in a window. ![get key](https://raw.github.com/jllord/sheetsee-cache/master/img/key.png)

Commit those changes and **LIKE WOAH** you now have a version of this website hooked to a spreadsheet that you can distrubute however you'd like.

## But How?

A Google Spreadsheet holds all the data and it is connected to this website using the goodies in [sheetsee.js](http://www.github.com/jlord/sheetsee.js). Everytime you visit the website, you'll have the most up to date data that has been entered into the spreadsheet. 
