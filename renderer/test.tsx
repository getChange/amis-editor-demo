import { types, applySnapshot } from 'mobx-state-tree';

// message notification (Base Model)
// 提供消息通知功能
export const Notification = types.model('Notification').views((self) => ({
	get notification() {
		return {
			success(msg: any) {
				console.log(msg);
			},
			error(msg: any) {
				console.error(msg);
			}
		};
	}
}));

// loadable (Base Model)
// 提供loading状态以及切换loading状态的方法
export const Loadable = types
	.model('Loadable', {
		loading: types.optional(types.boolean, false)
	})
	.actions((self) => ({
		setLoading(loading: boolean) {
			self.loading = loading;
		}
	}));

// remote resource (Base Model)
// 在Loadable, Notification基础上提供加载远程资源的能力。
export const RemoteResource = types.compose(Loadable, Notification).named('RemoteResource').actions((self) => ({
	async fetch(...args: []) {
		self.setLoading(true);
		try {
			// self.serviceCall：获取数据的接口方法
			// 需要在扩展RemoteRescource时定义在action
			const res = await self.serviceCall(...args);

			// self.data用于保存返回的数据
			// 需要在扩展RemoteRescource时定义在props
			applySnapshot(self.data, res);
		} catch (err) {
			self.notification.error(err);
		}
		self.setLoading(false);
	}
}));

// product (Model)
export const ProductItem = types.model('ProductItem', {
	prodName: types.string,
	price: types.number
	// ...
});

// product item list (Model)
export const ProductItemList = RemoteResource.named('ProductItemList').props({
	data: types.array(ProductItem)
});

// product list (Model)
export const ProductList = ProductItemList.named('ProductList').actions((self) => ({
	serviceCall(params) {
		return apis.getProductList(params);
	}
}));

// favorites (Model)
export const Favorites = ProductItemList.named('Favorites').actions((self) => ({
	serviceCall(params) {
		return apis.getFavorites(params);
	}
}));
