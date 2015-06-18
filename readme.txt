The project is all static HTML making extensive use of JSON and JS libraries.
All written in textedit so no environment to configure.
Entire website wont work from file:// URLs so a local webserver needs to be configured.
Code is scoped to a module using closures and filenames should be explanatory. Few comments but good function names.
TODO:
	It doesn't use any templating libraries but probably should (Mustache?)
	A number of older assets can probably be removed or merged together (Bootstrap, GSDK)
	The add system could be automated by just spitting out GeoJSON from the uploaded database. Beyond the current project scope though.
	Build libraries like grunt would be great for minifying scripts and CSS
	HTML templates should probably be moved out of the index file
