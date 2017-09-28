package com.swellsys.ncs.mapper;

import java.util.HashMap;

import org.playthm.core.annotation.Mapper;


@Mapper
public interface SubjectMapper {

	public HashMap<String, Object> select(HashMap<String, Object> params) throws Exception;
}
