document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const createBookForm = document.getElementById('create-book-form');
    const createLoanForm = document.getElementById('create-loan-form');
    const returnLoanForm = document.getElementById('return-loan-form');
    const logoutButton = document.getElementById('logout-button');

    const authSection = document.getElementById('auth-section');
    const mainSection = document.getElementById('main-section');
    const userNameSpan = document.getElementById('user-name');
    const booksList = document.getElementById('books-list');
    const membersList = document.getElementById('members-list');
    const loansList = document.getElementById('loans-list');
    const myLoansList = document.getElementById('my-loans-list');

    let currentUser = null;

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        try {
            await axios.post('/members', { name, email });
            alert('Registration successful');
        } catch (error) {
            alert(error.response.data);
        }
    });

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        try {
            const response = await axios.get('/members');
            const member = response.data.find(m => m.email === email);
            if (member) {
                currentUser = member;
                userNameSpan.textContent = member.name;
                authSection.style.display = 'none';
                mainSection.style.display = 'block';
                fetchAndDisplayData();
            } else {
                alert('Login failed');
            }
        } catch (error) {
            alert('Login failed');
        }
    });

    logoutButton.addEventListener('click', function () {
        currentUser = null;
        authSection.style.display = 'block';
        mainSection.style.display = 'none';
    });

    createBookForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const isbn = document.getElementById('book-isbn').value;
        try {
            await axios.post('/books', { title, author, isbn });
            alert('Book created successfully');
            fetchAndDisplayData();
        } catch (error) {
            alert('Failed to create book');
        }
    });

    createLoanForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const bookId = document.getElementById('loan-book-id').value;
        try {
            await axios.post('/loans', { book: { id: bookId }, member: { id: currentUser.id }, loanDate: new Date().toISOString().split('T')[0] });
            alert('Loan created successfully');
            fetchAndDisplayData();
        } catch (error) {
            alert(error.response.data);
        }
    });

    returnLoanForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const loanId = document.getElementById('return-loan-id').value;
        try {
            await axios.put(`/loans/return/${loanId}`);
            alert('Book returned successfully');
            fetchAndDisplayData();
        } catch (error) {
            alert('Failed to return book');
        }
    });

    async function fetchAndDisplayData() {
        try {
            const [booksResponse, membersResponse, loansResponse] = await Promise.all([
                axios.get('/books'),
                axios.get('/members'),
                axios.get('/loans')
            ]);

            booksList.innerHTML = '';
            booksResponse.data.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, ISBN: ${book.isbn}`;
                li.classList.add('list-group-item');
                booksList.appendChild(li);
            });

            membersList.innerHTML = '';
            membersResponse.data.forEach(member => {
                const li = document.createElement('li');
                li.textContent = `ID: ${member.id}, Name: ${member.name}, Email: ${member.email}`;
                li.classList.add('list-group-item');
                membersList.appendChild(li);
            });

            loansList.innerHTML = '';
            loansResponse.data.forEach(loan => {
                const li = document.createElement('li');
                li.textContent = `ID: ${loan.id}, Book ID: ${loan.book.id}, Member ID: ${loan.member.id}, Loan Date: ${loan.loanDate}, Return Date: ${loan.returnDate}`;
                li.classList.add('list-group-item');
                loansList.appendChild(li);
            });

            myLoansList.innerHTML = '';
            loansResponse.data
                .filter(loan => loan.member.id === currentUser.id && !loan.returnDate)
                .forEach(loan => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${loan.id}, Book ID: ${loan.book.id}, Loan Date: ${loan.loanDate}, Return Date: ${loan.returnDate}`;
                    li.classList.add('list-group-item');
                    myLoansList.appendChild(li);
                });
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }
});
