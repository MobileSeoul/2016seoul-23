package org.playthm.module.tld;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.util.FormatUtil;

public class CollTag {
	public static List<HashMap<String, Object>> list = null;
	
	@SuppressWarnings("unchecked")
	public static String getCollName(Object codeList, String codeId) {
		
		if(list == null && codeList == null){
			return codeId;
		}else if(codeList != null){
			list = (List<HashMap<String, Object>>)codeList;	
		}
		
		for(HashMap<String, Object> map : list){
			if(FormatUtil.toString(map.get("CD")).equals(codeId)){
				return FormatUtil.toString(map.get("CONT")).replaceAll("\r\n", "<br />").replaceAll("\n", "<br>");
			}
		}
		return codeId;
	}
}
