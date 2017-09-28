package com.swellsys.ncs.service;

import java.util.HashMap;

import org.playthm.core.util.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swellsys.ncs.mapper.SubjectMapper;

@Service("subjectService")
public class SubjectService {

	@Autowired
	SubjectMapper subjectMapper;

	public HashMap<String, Object> select(HashMap<String, Object> params) throws Exception {
		
		return subjectMapper.select(PageUtil.getParams(params));
	}
}
