package org.playthm.core.model;


public enum PageAuth {

	DENY(0),
	OPEN(1),
	AUTH(2);

	private int pageAuth;

	private PageAuth(int pageAuth) {
		this.pageAuth = pageAuth;
	}

	public int getValue() {
		return pageAuth;
	}
}
