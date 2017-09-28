package com.swellsys.ncs.mapper;

import java.util.HashMap;

import org.playthm.core.annotation.Mapper;


@Mapper
public interface MemberMapper {

	//회원 로그인 체크
	public int selectMemberLoginCheck(HashMap<String, Object> params) throws Exception;
	
	//회원 로그인
	public HashMap<String, Object> selectMemberLogin(HashMap<String, Object> params) throws Exception;
	
	//회원 아이디 가입여부 확인
	public int selectMemberCount(HashMap<String, Object> params) throws Exception;

	//회원 이메일 가입여부 확인
	public int selectEmailCount(HashMap<String, Object> params) throws Exception;
	
	//회원 전화번호 확인
	public int selectHpCount(HashMap<String, Object> params) throws Exception;
	
	
	//회원 가입
	public int insertMember(HashMap<String, Object> params) throws Exception;
	
	//회원 수정
	public int updateMember(HashMap<String, Object> params) throws Exception;
	
	//자동로그인 rand값 저장
	public int updateMemberRandSeq(HashMap<String, Object> params) throws Exception;

	//자동 로그인 값 로그인 확인
	public int selectMemberLoginRandCheck(HashMap<String, Object> params) throws Exception;
	
	//회원찾기
	public HashMap<String, Object> selectMemberFind(HashMap<String, Object> params) throws Exception;
	
	//회원찾기 - 패스워드
	public HashMap<String, Object> selectMemberFindPw(HashMap<String, Object> params) throws Exception;	
	
	//회원 패스워드 변경
	public int updateMemberPw(HashMap<String, Object> params) throws Exception;
	
	
}
