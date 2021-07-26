import { registerEditorPlugin } from 'amis-editor';
import { Renderer } from 'amis';
import { RendererProps } from 'amis/lib/factory';
import React from 'react';
export interface MyRendererProps extends RendererProps {
	target?: string;
}

@Renderer({
	test: /\bmy-renderer$/,
	name: 'my-renderer'
})
class MyRenderer extends React.Component<MyRendererProps> {
	static defaultProps = {
		target: 'test'
	};

	render() {
		const { target } = this.props;

		return <p>Hello {target}!</p>;
	}
}
registerEditorPlugin(MyRenderer);
