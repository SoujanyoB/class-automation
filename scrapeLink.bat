@ECHO off
set code=%1
if %code%==304 (
	node scraper/scraper.js --url https://classroom.google.com/u/0/c/MTI3NjE4NjQyOTc4
)
if %code%==303 (
	node scraper/scraper.js --url https://classroom.google.com/u/0/c/MTI3MzQyOTQ2MzI1
)