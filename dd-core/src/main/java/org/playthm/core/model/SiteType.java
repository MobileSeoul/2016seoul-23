package org.playthm.core.model;


public enum SiteType {

	NORMAL(1),
	ADMIN(2),
	FRONT(3),
	MOBILE(4),
	BATCH(5);

	private int siteType;

	private SiteType(int siteType) {
		this.siteType = siteType;
	}

	public int getValue() {
		return siteType;
	}
}
