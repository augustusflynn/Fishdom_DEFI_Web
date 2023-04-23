import { DownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigations } from "../../routerNav";

function MenuTop() {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedKey, setSelectedKey] = useState(
		location?.pathname?.replace("/", "")
	);

	const handleClick = (key, redirect) => {
		if (redirect) {
			window.location = redirect;
			return;
		}
		var currentPathName = location.pathname;
		if (currentPathName === "/" + key) {
			return;
		}
		navigate(key);
		setSelectedKey(key);
		window.scrollTo(0, 0);
	};
	const handleScroll = (key, hash) => {
		navigate(key);
		if (hash) {
			window.location.hash = hash;
		}
	};

	useEffect(() => {
		setSelectedKey(location?.pathname?.replace("/", ""));
	}, [location]);

	return (
		<div className="menu-top">
			{navigations.map((item, index) => {
				let isSelect = item?.childrent?.length > 0 && item.childrent.findIndex(
					(item) => item.path === selectedKey
				);
				return (
					<div
						className={`item-top ${isSelect >= 0 ? "is-selected" : ""}`}
						key={index}
						onClick={() => {
							if (item.isURLOnly) {
								window.open(item.path, "_blank")
							}
						}}
					>
						<span className="c2i-color-gray">{item.title}</span>
						{item.childrent && (
							<>
								<DownOutlined />
								<div className="tooltip">
									{item.childrent.map((item2, index2) => {
										return !item2.hash ? (
											<div
												onClick={() => handleClick(item2.path, item2.redirect)}
												key={index2}
											>
												{item2.title}
											</div>
										) : (
											<div
												onClick={() => handleScroll(item2.path, item2.hash)}
												key={index2}
											>
												{item2.title}
											</div>
										);
									})}
								</div>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default MenuTop;
