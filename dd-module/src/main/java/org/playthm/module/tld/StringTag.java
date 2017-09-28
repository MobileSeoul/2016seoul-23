package org.playthm.module.tld;

import org.playthm.core.util.FormatUtil;


public class StringTag {
	/**
	 * 숫자 소수점 처리
	 * @param str
	 * @return
	 */
	public static String roundCal(String str, int powNum) {
		try {
			return FormatUtil.toNumber(FormatUtil.round(str.replaceAll(",", ""), 2)).toString();
		} catch (Exception e) {
			return str;
		}
	}
	
	public static String roundCal(String str) {
		return roundCal(str, 2);
	}
	
	public static String roundCal1(String str) {
		return roundCal(str, 1);
	}
	
	public static String roundCal2(String str) {
		return roundCal(str, 2);
	}
	
	/**
	 * 과목코드 변경 Return
	 * @param subjCode 과목코드
	 * @return
	 */
	public static String subjectCode(String subjCode) {
		try {
			if (subjCode.indexOf("#") != -1) {
				return subjCode.substring(0, subjCode.indexOf("#"));
			}else{
				return subjCode;
			}
		} catch (Exception e) {
			return subjCode;
		}
	}
}
