const steps = [
    {
        id: 'welcome',
        type: 'intro',
        title: 'Welcome to your safe space',
        description: 'Take a deep breath. This short journey will help us connect you with a counselor who truly understands your gravity.',
        buttonText: 'Begin'
    },
    {
        id: 'focus',
        type: 'selection',
        title: 'What is primarily on your mind?',
        options: [
            { value: 'anxiety', label: 'Anxiety & Overwhelm' },
            { value: 'depression', label: 'Sadness & Depression' },
            { value: 'stress', label: 'Work & Stress' },
            { value: 'relationships', label: 'Relationships' },
            { value: 'growth', label: 'Personal Growth' }
        ]
    },
    {
        id: 'style',
        type: 'selection',
        title: 'What helps you feel most supported?',
        options: [
            { value: 'listener', label: 'A compassionate listener' },
            { value: 'active', label: 'Active guidance & tools' },
            { value: 'challenger', label: 'Someone to challenge me' },
            { value: 'holistic', label: 'Holistic & spiritual approach' }
        ]
    },
    {
        id: 'preferences',
        type: 'selection',
        title: 'Any preferences for your counselor?',
        options: [
            { value: 'nopref', label: 'No specific preference' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'nonbinary', label: 'Non-binary' }
        ]
    },
    {
        id: 'processing',
        type: 'processing',
        title: 'Finding your balance...',
        duration: 3000
    },
    {
        id: 'results',
        type: 'results',
        title: 'We found these matches for you'
    }
];

const mockTherapists = [
    { name: 'Dr. Sarah Chen', specialty: 'Anxiety & Stress', style: 'active', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { name: 'Mark Rivers', specialty: 'Relationships', style: 'listener', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
    { name: 'Elena Rodriguez', specialty: 'Holistic Growth', style: 'holistic', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
    { name: 'James Wilson', specialty: 'Depression & Trauma', style: 'challenger', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
];

let currentStepIndex = 0;
const userAnswers = {};

const contentDiv = document.getElementById('wizard-content');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressFill = document.getElementById('progressFill');

function init() {
    renderStep();
    updateControls();
}

function updateControls() {
    // Progress
    const progress = ((currentStepIndex) / (steps.length - 1)) * 100;
    progressFill.style.width = `${progress}%`;

    // Buttons
    const step = steps[currentStepIndex];

    if (step.type === 'intro') {
        prevBtn.classList.add('hidden');
        nextBtn.textContent = step.buttonText || 'Next';
        nextBtn.disabled = false;
        nextBtn.classList.remove('hidden');
    } else if (step.type === 'processing') {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    } else if (step.type === 'results') {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden'); // Buttons are on cards
    } else {
        prevBtn.classList.remove('hidden');
        nextBtn.textContent = 'Next';
        nextBtn.classList.remove('hidden');
        // Disable next until selection
        nextBtn.disabled = !userAnswers[step.id];
    }
}

function renderStep() {
    const step = steps[currentStepIndex];

    // Animation out
    contentDiv.style.opacity = '0';
    contentDiv.style.transform = 'translateY(10px)';

    setTimeout(() => {
        contentDiv.innerHTML = '';

        const title = document.createElement('h2');
        title.className = 'step-title';
        title.textContent = step.title;
        contentDiv.appendChild(title);

        if (step.description) {
            const desc = document.createElement('p');
            desc.className = 'step-desc';
            desc.textContent = step.description;
            contentDiv.appendChild(desc);
        }

        if (step.type === 'selection') {
            const optionsGrid = document.createElement('div');
            optionsGrid.className = 'options-grid';

            step.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-card';
                if (userAnswers[step.id] === opt.value) btn.classList.add('selected');

                btn.innerHTML = `<span class="option-label">${opt.label}</span>`;
                btn.onclick = () => selectOption(step.id, opt.value, btn);
                optionsGrid.appendChild(btn);
            });
            contentDiv.appendChild(optionsGrid);
        }

        if (step.type === 'processing') {
            const loader = document.createElement('div');
            loader.className = 'breathing-loader';
            contentDiv.appendChild(loader);

            setTimeout(() => {
                nextStep();
            }, step.duration);
        }

        if (step.type === 'results') {
            const resultsGrid = document.createElement('div');
            resultsGrid.className = 'results-grid';

            // Simple logic: just show 3 random or top matches for now
            mockTherapists.slice(0, 3).forEach(therapist => {
                const card = document.createElement('div');
                card.className = 'therapist-card';
                card.innerHTML = `
                    <div class="therapist-img" style="background-image: url('${therapist.image}')"></div>
                    <div class="therapist-info">
                        <h3>${therapist.name}</h3>
                        <p>${therapist.specialty}</p>
                        <span class="badge">${therapist.style}</span>
                        <button class="btn-primary mt-4">Book Session</button>
                    </div>
                `;
                resultsGrid.appendChild(card);
            });
            contentDiv.appendChild(resultsGrid);
        }

        // Animation in
        requestAnimationFrame(() => {
            contentDiv.style.opacity = '1';
            contentDiv.style.transform = 'translateY(0)';
        });

        updateControls();
    }, 200);
}

function selectOption(stepId, value, element) {
    userAnswers[stepId] = value;

    // UI Update
    const allOptions = element.parentElement.querySelectorAll('.option-card');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    // Auto-advance delay or just enable button?
    // Let's just enable button to give user control
    updateControls();
}

function nextStep() {
    if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        renderStep();
    }
}

function prevStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderStep();
    }
}

nextBtn.addEventListener('click', nextStep);
prevBtn.addEventListener('click', prevStep);

init();
