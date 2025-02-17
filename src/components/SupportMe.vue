<template>
    <p class="buttons is-centered">
        <a
            href="https://ko-fi.com/Q5Q414JWQD"
            target="_blank"
            class="button is-info has-icon ko-fi"
            title="on Ko-Fi"
        >
            <span class="icon">
                <img class="icon" src="/ko-fi.svg" alt="Ko-fi" />
            </span>
        </a>
        <a
            href="https://revolut.me/mihlywer"
            target="_blank"
            class="button is-white has-icon revolut"
            title="on Revolut"
        >
            <span class="icon">
                <img class="icon" src="/revolut.svg" alt="Revolut" />
            </span>
        </a>
        <a
            href="https://paypal.me/rozzy87"
            target="_blank"
            class="button is-link has-icon paypal"
            title="on PayPal"
        >
            <span class="icon">
                <img class="icon" src="/paypal.svg" alt="PayPal" />
            </span>
        </a>
    </p>
</template>

<style scoped>
.ko-fi {
    background-color: #00b9fe;
}

.ko-fi:hover:not(:active) {
    background-color: #57d2ff;
}

.revolut {
    background-color: white;
}

.revolut:hover:not(:active) {
    background-color: #eee;
}

.paypal {
    background-color: #142c8e;
}

.paypal:hover:not(:active) {
    background-color: #3349a1;
}
</style>
