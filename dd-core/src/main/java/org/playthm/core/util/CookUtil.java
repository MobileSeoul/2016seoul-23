package org.playthm.core.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.playthm.core.model.Paging;

/**
 *
 * @author Administrator
 *
 */

public class CookUtil {
	
	public static void setCookie(HttpServletResponse response, String cookName, String cookValue){
		Cookie cookie = new Cookie(cookName, cookValue);
	    cookie.setMaxAge(60*60*24*365);            // 쿠키 유지 기간(이부분이 없으면 브라우저 종료시 사라짐)
	    cookie.setPath("/");                               // 모든 경로에서 접근 가능하도록 
	    //cookie.setDomain("windy.com");//이부분을 적용하면 서브 도메인간 공유 가능
	    response.addCookie(cookie);                // 쿠키저장
	}
	
	
	
	public static String getCookie(HttpServletRequest request, String cookName){
		String reStr = "";
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
		    for (Cookie cookie : cookies) {
		        if(cookName.equals(cookie.getName())){
		        	reStr = cookie.getValue();
		        	break;
		        }
		    }
		}
		return reStr;
	}
	
	// 전체 쿠키 삭제하기	
	public static void removeAllCookie(HttpServletRequest request, HttpServletResponse response){

	    Cookie[] cookies = request.getCookies();
	    if(cookies != null){
	    	 for(int i=0; i < cookies.length; i++){
	             // 쿠키의 유효시간을 0으로 설정하여 만료시킨다
	             cookies[i].setMaxAge(0) ;
	             cookies[i].setPath("/");
	             // 응답 헤더에 추가한다
	             response.addCookie(cookies[i]) ;
	         }
	    }
	}
	
	public static void removeCookie(HttpServletRequest request, HttpServletResponse response , String cookName){
		// 특정 쿠키만 삭제하기
	    Cookie kc = new Cookie(cookName, null) ;
	    kc.setMaxAge(0) ;
	    kc.setPath("/");
	    response.addCookie(kc) ;
	}

     
     
    
	
	
}
