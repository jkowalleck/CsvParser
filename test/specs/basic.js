if ( typeof describe == "function" ) {


describe("Basic Test:", function()
{
	"use strict";

	it("setCsvProperties", function()
	{	
		var parser = new CsvParser();
		
		var error_delim = new Error("Delimiter needs to be a string")
		  , error_enclo = new Error("Enclose needs to be a string")
		  , error_escap = new Error("Escape needs to be a string")
		  ; 
		
		expect(function(){ parser.setCsvProperties(1,undefined,undefined); }).toThrow(error_delim);
		expect(function(){ parser.setCsvProperties(undefined,2,undefined); }).toThrow(error_enclo);
		expect(function(){ parser.setCsvProperties(undefined,undefined,3); }).toThrow(error_escap);
	
		// @TODO 
	});
	
	it("_isString", function()
	{	
		var parser = new CsvParser();

		expect(parser._isString("string")).toBe(true);
		expect(parser._isString(1234)).toBe(false);
		expect(parser._isString(null)).toBe(false);
		expect(parser._isString(undefined)).toBe(false);
		expect(parser._isString()).toBe(false);
		expect(parser._isString(false)).toBe(false);
		expect(parser._isString(true)).toBe(false);
		expect(parser._isString([1,2,3])).toBe(false);
		expect(parser._isString([])).toBe(false);
		expect(parser._isString({a:1})).toBe(false);
	});
		
	// @TODO
});


}