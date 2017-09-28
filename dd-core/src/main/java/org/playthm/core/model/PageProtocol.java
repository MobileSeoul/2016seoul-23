package org.playthm.core.model;


public enum PageProtocol {

	HTTP(1),
	HTTPS(2);

	private int pageProtocol = 1;

	private PageProtocol(int pageType) {
		this.pageProtocol = pageType;
	}

	public int getValue() {
		return pageProtocol;
	}
}
