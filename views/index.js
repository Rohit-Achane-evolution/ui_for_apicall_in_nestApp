document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/cats';
    const tableBody = document.getElementById('catTableBody');
    const catModal = new bootstrap.Modal(document.getElementById('catModal'));
    const catForm = document.getElementById('catForm');
    const saveCatButton = document.getElementById('saveCat');

    // Fetch and display all cats
    async function fetchCats() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const cats = await response.json();
            tableBody.innerHTML = ''; // Clear existing table rows

            cats.forEach(cat => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cat.id}</td>
                    <td>${cat.name}</td>
                    <td>${cat.description}</td>
                    <td>${cat.actions}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-cat" data-id="${cat.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-cat" data-id="${cat.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.edit-cat').forEach(button => {
                button.addEventListener('click', (e) => editCat(e.target.dataset.id));
            });
            document.querySelectorAll('.delete-cat').forEach(button => {
                button.addEventListener('click', (e) => deleteCat(e.target.dataset.id));
            });
        } catch (error) {
            console.error('There was a problem fetching the cat data:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        Error loading cat data. Please try again later.
                    </td>
                </tr>
            `;
        }
    }

    // Save (Create or Update) a cat
    async function saveCat() {
        const id = document.getElementById('catId').value;
        const cat = {
            name: document.getElementById('catName').value,
            description: document.getElementById('catDescription').value,
            actions: document.getElementById('catActions').value
        };

        const url = id ? `${apiUrl}/${id}` : apiUrl;
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cat),
            });
            if (!response.ok) throw new Error('Network response was not ok');

            catModal.hide();
            fetchCats();
        } catch (error) {
            console.error('There was a problem saving the cat data:', error);
            alert('Failed to save cat data. Please try again.');
        }
    }

    // Edit a cat
    async function editCat(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const cat = await response.json();
            document.getElementById('catId').value = cat.id;
            document.getElementById('catName').value = cat.name;
            document.getElementById('catDescription').value = cat.description;
            document.getElementById('catActions').value = cat.actions;

            catModal.show();
        } catch (error) {
            console.error('There was a problem fetching the cat data for editing:', error);
            alert('Failed to load cat data for editing. Please try again.');
        }
    }

    // Delete a cat
    async function deleteCat(id) {
        if (confirm('Are you sure you want to delete this cat?')) {
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Network response was not ok');

                fetchCats();
            } catch (error) {
                console.error('There was a problem deleting the cat:', error);
                alert('Failed to delete cat. Please try again.');
            }
        }
    }

    // Clear form when the "Add Cat" button is clicked
    document.querySelector('[data-bs-target="#catModal"]').addEventListener('click', () => {
        catForm.reset();
        document.getElementById('catId').value = '';
    });

    // Save cat when the save button is clicked
    saveCatButton.addEventListener('click', saveCat);

    // Fetch and display cats when the page loads
    fetchCats();
});
