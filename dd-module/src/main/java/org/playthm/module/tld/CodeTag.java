package org.playthm.module.tld;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.model.CodeVO;


public class CodeTag {
	
	public static List<HashMap<String, Object>> getCodeList(Object code, String parentCode) {
		return ((CodeVO)code).getCodeList(parentCode);
	}
	
	public static String getName(Object code, String parentCode, String codeValue) {
		String name = ((CodeVO)code).getName(parentCode, codeValue);
		return "".equals(name) ? codeValue : name;
	}
	
	public static String getNameOrg(Object code, String parentCode, String codeValue) {
		return ((CodeVO)code).getName(parentCode, codeValue);
	}
	
	public static String getCode(Object code, String parentCode, String codeName) {
		String codeValue = ((CodeVO)code).getCode(parentCode, codeName);
		return "".equals(codeValue) ? codeName : codeValue;
	}
}
