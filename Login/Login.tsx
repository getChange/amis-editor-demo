import React from 'react';
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { IMainStore } from '../store/IMainStore';
import { RouteComponentProps } from 'react-router-dom';
import { render as renderAmis, Layout, Switch, classnames as cx, toast } from 'amis';

export default inject('store')(
	observer(function({ store, location, history, match }: { store: IMainStore } & RouteComponentProps) {
		console.log(store);

		return (
			<Layout>
				<div>
					{renderAmis(
						{
							type: 'page',
							body: {
								type: 'form',
								title: '水平模式',
								mode: 'horizontal',
								api: 'http://httpbin.org/post',
								redirect: '/hello-world',
								body: [
									{
										type: 'input-text',
										name: 'text',
										label: '名称',
										required: true
									},
									{
										type: 'input-password',
										name: 'password',
										label: '密码'
									},
									{
										type: 'checkbox',
										name: 'rememberMe',
										label: '记住登录'
									}
								]
							}
						},
						{},
						{
							// 下面三个接口必须实现
							fetcher: ({
								url, // 接口地址
								method, // 请求方法 get、post、put、delete
								data, // 请求数据
								responseType,
								config, // 其他配置
								headers // 请求头
							}: any) => {
								config = config || {};
								config.withCredentials = true;
								responseType && (config.responseType = responseType);

								if (config.cancelExecutor) {
									config.cancelToken = new (axios as any).CancelToken(config.cancelExecutor);
								}

								config.headers = headers || {};

								if (method !== 'post' && method !== 'put' && method !== 'patch') {
									if (data) {
										config.params = data;
									}

									return (axios as any)[method](url, config);
								} else if (data && data instanceof FormData) {
									config.headers = config.headers || {};
									config.headers['Content-Type'] = 'multipart/form-data';
								} else if (
									data &&
									typeof data !== 'string' &&
									!(data instanceof Blob) &&
									!(data instanceof ArrayBuffer)
								) {
									data = JSON.stringify(data);
									config.headers = config.headers || {};
									config.headers['Content-Type'] = 'application/json';
								}

								return (axios as any)[method](url, data, config);
							},
							isCancel: (value: any) => (axios as any).isCancel(value)
						}
					)}
				</div>
			</Layout>
		);
	})
);
