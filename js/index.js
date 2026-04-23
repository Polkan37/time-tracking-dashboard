const userNav = document.querySelector('.user .navigation');
const buttons = userNav.querySelectorAll('button');
const container = document.querySelector('.trackers');
const periodLabel = { daily: 'Yesterday', weekly: 'Last week', monthly: 'Last month' };


const DATA = fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        // initial period based on markup (button with .active) or default to weekly
        const activeBtn = userNav.querySelector('button.active');
        const initial = activeBtn ? activeBtn.textContent.trim().toLowerCase() : 'weekly';

        data.forEach(item => {
            const tracker = document.createElement('div');
            tracker.className = `tracker ${slugify(item.title)}`;
            const timeframes = item.timeframes[initial];
            const current = timeframes.current;
            const previous = timeframes.previous;
            const time = `${current}hr${current !== 1 ? 's' : ''}`;
            const prevTime = `${periodLabel[initial]} - ${previous}hr${previous !== 1 ? 's' : ''}`;

            tracker.innerHTML = `
                    <div class="details">
                        <div class="navigation">
                            <p class="title">${item.title}</p>
                            <div class="buttons">
                                <button>
                                    <img src="./images/icon-ellipsis.svg" alt="More Options">
                                </button>
                            </div>
                        </div>
                        <div class="details__text">
                            <h2 class="time">$${time}</h2>
                            <p class="previous">${prevTime}</p>
                        </div>
                    </div>
                `;
            container.appendChild(tracker);
        });


        function update(period) {
            data.forEach(item => {
                const track = container.querySelector(`.tracker.${slugify(item.title)}`);
                if (!track) return;
                const tEl = track.querySelector('.time');
                const pEl = track.querySelector('.previous');
                const current = item.timeframes[period].current;
                const previous = item.timeframes[period].previous;
                tEl.textContent = `${current}hr${current !== 1 ? 's' : ''}`;
                pEl.textContent = `${periodLabel[period]} - ${previous}hr${previous !== 1 ? 's' : ''}`;
            });
        }


        // wire up buttons
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const period = btn.textContent.trim().toLowerCase();
                update(period);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


function slugify(str) {
    return String(str).toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // spaces -> hyphens
        .replace(/[^a-z0-9-]/g, '') // remove invalid chars
        .replace(/-+/g, '-')        // collapse multiple hyphens
        .replace(/^-+|-+$/g, '');   // trim hyphens
}