package org.playthm.module.tld;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTag {
	
	public static String toDate(){
		return toDateP("yyyy-MM-dd");
	}
	
	public static String toDateP(String patten){
		Date d = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(patten);
		return sdf.format(d);
	}
	
}
