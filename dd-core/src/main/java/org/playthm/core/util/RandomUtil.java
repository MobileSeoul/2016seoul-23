package org.playthm.core.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.playthm.core.model.Paging;

/**
 *
 * @author Administrator
 *
 */

public class RandomUtil {
	
	private static final char[] chars;

	  static {
	    StringBuilder tmp = new StringBuilder();
	    for (char ch = '0'; ch <= '9'; ++ch)
	      tmp.append(ch);
	    for (char ch = 'a'; ch <= 'z'; ++ch)
	      tmp.append(ch);
	    for (char ch = 'A'; ch <= 'Z'; ++ch)
		      tmp.append(ch);
	    chars = tmp.toString().toCharArray();
	  }   

 

	  

	  public static String RandomString(int length) {
		  if (length < 1)
	    	throw new IllegalArgumentException("length < 1: " + length);
	    StringBuilder randomString = new StringBuilder();
	    
	    Random random = new Random();
	    
	    for(int i=0; i < length; i++){
	    	randomString.append(chars[random.nextInt(chars.length)]);
	    }
	    return randomString.toString();
	    
	  }
	
}
