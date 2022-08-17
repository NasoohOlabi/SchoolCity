interface MainContentProps {
	children: any;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
	return <div className="main-content">{children}</div>;
};

export default MainContent;
