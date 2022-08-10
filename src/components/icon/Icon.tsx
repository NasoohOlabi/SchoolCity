interface IconProps {
	name: string;
	size?: string;
	color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size, color }) => {
	return <i className={"fa-" + name} color={color} />;
};

export default Icon;
