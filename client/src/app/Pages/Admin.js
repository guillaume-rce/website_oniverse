const Admin = () => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    const [user, setUser] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/user/${userId}`)
            .then(
                (response) => response.json(),
                (error) => {
                    console.error('Failed to fetch user', error);
                    setError('Failed to fetch user');
                }
            )
            .then((data) => {
                if (!data) {
                    console.error('No user found');
                    return;
                }

                setUser(data);
            });
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.role !== 1) {
        window.location.href = '/';
    }

    const [o]

}