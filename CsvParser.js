/**
 * CSV parser 
 * - not fully complete, yet 
 *
 * @author jan Kowalleck <jan.kowalleck@googlemail.com>
 */
 
CsvParser = function (delimiter, enclose, escape) 
{
	this.data = [];
	
	this.delimiter = delimiter || ',';
	this.enclose = enclose || '"';
	this.escape = escape || '\\';
};

CsvParser.prototype = {
	constructor : CsvParser ,
	parse : function (string)
	{
	  // split on \r oder \n ... 
	  // dann parse einfahc die lines ... 
	} ,
	parseLines : function (lines)
	{
		var escape = this.escape, escapeRE = new RegExp(escape+"[^"+escape+"]","g")
		  , delimiter = this.delimiter 
		  , enclose = this.enclose
		  ; 
		
		var split, lineData=[], lineField , openField=false , lineField_length;
		for ( var l=0, ll=lines.length; l<ll ; ++l )
		{
			split = lines[l].split(delimiter);
			for ( var s=0, sl=split.length ; s < sl ; ++s )
			{
				lineField = split[s];
				
				if ( openField )
				{
					if ( s > 0 ) 
					{
						openField += delimiter;
					}
					lineField = openField + lineField;
					openField = true;
				}				
				
				if ( openField || lineField[0] == enclose ) 
				{
					openField = false;
					lineField_length = lineField.length;
					if ( lineField[lineField_length-1] != enclose || lineField[lineField_length-2] == escape )
					{
						openField = lineField;
						continue;
					}
					lineField = lineField.slice(1, -1);
				}
				
				lineData.push(lineField.replace(escapeRE,""));
			}

			if ( openField )
			{
				openField += "\n";
			}
			else
			{			
				this.data.push(lineData);
				lineData = [];
			}
		}		
	}
};
