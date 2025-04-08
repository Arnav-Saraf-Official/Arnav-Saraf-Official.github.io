
    function toggleSection(baseId) {
        const section = document.getElementById(`collapsibleSection${baseId.slice(-1)}`);
        const button = document.querySelector(`#${baseId} > button`);

        // Toggle the "expanded" class to show/hide the section
        section.classList.toggle('expanded');

        // Change button text depending on whether the section is expanded or collapsed
        if (section.classList.contains('expanded')) {
            button.innerText = 'Collapse';
        } else {
            button.innerText = 'Learn More';
        }
    }

