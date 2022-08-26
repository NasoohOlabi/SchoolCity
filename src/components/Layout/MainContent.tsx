interface MainContentProps {
	children: any;
}

const MainContent: (args: MainContentProps) => JSX.Element = ({ children }) => {
	return <div className="main-content">{children}</div>;
};

export default MainContent;
