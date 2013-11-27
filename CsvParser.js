/**
 * CSV parser
 *
 * @author jan Kowalleck <jan.kowalleck@googlemail.com>
 */

CsvParser = function (delimiter, enclose, escape) {
	this.reset();

	this.setCsvProperties(delimiter, enclose, escape);
};

CsvParser.prototype = {
	constructor : CsvParser ,

	reset : function () {
		this.data = [];
	} ,

	_isString : function (something) {
		return ( typeof something == "string" );
	} ,

	setCsvProperties : function (delimiter, enclose, escape) {
		delimiter = delimiter || ',';
		enclose   = enclose   || '"';
		escape    = escape    || '\\'
	
		if ( !this._isString(delimiter) ) { throw new Error("Delimiter needs to be a string"); }
		if ( !this._isString(enclose)   ) { throw new Error("Enclose needs to be a string"); }
		if ( !this._isString(escape)    ) { throw new Error("Escape needs to be a string"); }

		var slice = String.prototype.slice;
		var sliceSpan = [0, 1];

		this.delimiter = slice.apply(delimiter, sliceSpan) ;
		this.enclose   = slice.apply(enclose, sliceSpan);
		this.escape    = slice.apply(escape, sliceSpan);
	} ,

	startsOpenField : function (string) {
		if ( ! string.length )
		{
			return false;
		}

		return ( string[0] == this.enclose );
	} ,
	endsOpenField : function (string) {
		var string_length = string.length;
		if ( ! string_length )
		{
			return false;
		}

		var endsEnclose = ( string[string_length -1] == this.enclose );
		if ( !endsEnclose )
		{
			return false;
		}

		var escape = this.escape;
		var escaped = false;
		for ( var c=string_length-1 , charBefore1,charBefore2 ; c >= 0 ; )
		{
			charBefore1 = string[--c];
			if ( charBefore1 != escape )
			{
				break;
			}
			charBefore2 = string[--c];
			if ( charBefore2 != escape )
			{
				escaped = true;
				break;
			}
		}
		if ( escaped )
		{
			return false;
		}

		return true;
	} ,
	isOpenField : function (string) {
		return this.startsOpenField(string) && ( string.length==1 || !this.endsOpenField(string) );
	} ,
	/* untested >> splitTrailingOpenFiled : function (lines) {
		var line_length = lines.length;
		if ( ! line_length )
		{
			return false;
		}
		var lastLine = lines[line_length -1];

		var lastLine_length = lastLine.length;
		if ( ! lastLine_length )
		{
			return false;
		}
		var lastField = lastLine[lastLine_length -1];

		var isOpenFiled = this.isOpenField(lastField);
		if  ( ! isOpenFiled )
		{
			return false;
		}

		return lastLine.pop();
	} , */

	trimOpenFiled : function (string , left, right) {
		if ( left && right )
			return string.slice(1, -1);

		if ( left )
			return string.slice(1);

		if ( right )
			return string.slice(0, -1);

		return string;
	} ,

	clearEscape : function (string) {
		return string.replace(new RegExp("\\"+this.escape+"(.)","g"),"$1");
	} ,

	lineSplitRE : /\r\n|\n|\r/ ,
	splitLines : function (string) {
		return string.split(this.lineSplitRE);
	} ,

	parse : function (string) {
		var trailingOpenLine = this.parseLines(this.splitLines(string));
		if ( trailingOpenLine )
		{
			this.data.push(trailingOpenLine);
		}
	} ,
	parseLines : function (lines) {
		// algorithm totally unoptimized so the job is clear
		this.reset();

		var data = [];

		var delimiter = this.delimiter;

		var openField=false;
		for ( var l=0, ll=lines.length , line,split; l<ll ; ++l )
		{
			line = lines[l];
			if ( openField !== false )
			{
				if ( l > 0 )
				{
					openField += "\n";
				}
			}

			split = line.split(delimiter);
			for ( var s=0, sl=split.length , lineField,lineData=(openField?data.pop():[]) ; s<sl ; ++s )
			{
				lineField = split[s];

				if ( openField !== false )
				{
					if ( s > 0 )
					{
						openField += delimiter;
					}
					openField += lineField;
				}
				else if ( this.startsOpenField(lineField) )
				{
					openField = lineField = this.trimOpenFiled(lineField, true, false);
				}

				if ( openField !== false )
				{
					if ( !this.endsOpenField(openField) )
					{
						continue;
					}

					lineField = this.trimOpenFiled(openField, false, true);
					openField = false;
				}

				lineData.push(this.clearEscape(lineField));
			}

			data.push(lineData);
		}

		this.data = data;

		if ( openField !== false )
		{
			var trailingOpenLine = data.pop();
			trailingOpenLine.push(this.clearEscape(openField));
			return trailingOpenLine;
		}

		return false;
	}
};

