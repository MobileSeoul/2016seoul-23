package org.playthm.core.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.playthm.core.model.Paging;

/**
 *
 * @author Administrator
 *
 */

public class GMailUtil {
	public static String mailFrom = "jsobar01@gmail.com";	//보내는 사람 메일주소
	
	
	public static boolean sendMail(String toMail,String subject ,String message){
		return sendMail(toMail, subject, message ,mailFrom);
	}
	
	public static boolean sendMail(String toMail,String subject ,String message ,String fromMail){
		return sendMail(toMail, subject, message ,fromMail , "html");
	}
	
	
	public static boolean sendMail(String toMail,String subject ,String message ,String fromMail ,String bodyType){
		boolean result = true;
		Properties p = new Properties();
		p.put("mail.smtp.user", fromMail); // Google계정@gmail.com으로 설정
		p.put("mail.smtp.host", "smtp.gmail.com");
		p.put("mail.smtp.port", "465");
		p.put("mail.smtp.starttls.enable","true");
		p.put( "mail.smtp.auth", "true");	 
		p.put("mail.smtp.debug", "true");
		p.put("mail.smtp.socketFactory.port", "465"); 
		p.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory"); 
		p.put("mail.smtp.socketFactory.fallback", "false");
		//Security.addProvider(new com.sun.net.ssl.internal.ssl.Provider());
	 
		try {
			Authenticator auth = new SMTPAuthenticator();
			Session session = Session.getInstance(p, auth);
			session.setDebug(true); // 메일을 전송할 때 상세한 상황을 콘솔에 출력한다.
			//session = Session.getDefaultInstance(p);
			MimeMessage msg = new MimeMessage(session);
			
			msg.setSubject(subject);
			Address fromAddr = new InternetAddress(fromMail); // 보내는 사람의 메일주소
			msg.setFrom(fromAddr);
			Address toAddr = new InternetAddress(toMail);  // 받는 사람의 메일주소
			msg.addRecipient(Message.RecipientType.TO, toAddr); 
			
			if(bodyType.equals("html")){
				msg.setContent(message, "text/html;charset=UTF-8");
			}else{
				msg.setContent(message, "text/plain;charset=UTF-8");				
			}			
			System.out.println("Message: " + msg.getContent());
			Transport.send(msg);
			System.out.println("Gmail SMTP서버를 이용한 메일보내기 성공");
		}catch (Exception mex) { // Prints all nested (chained) exceptions as well 
			System.out.println("Gmail 발송실패");
			mex.printStackTrace();
			result = false;
		}
		return result;
	}
	 
	public static class SMTPAuthenticator extends javax.mail.Authenticator {
		public PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication("*****", "*****"); // Google id, pwd, 주의) @gmail.com 은 제외하세요
		}
	} 
}
