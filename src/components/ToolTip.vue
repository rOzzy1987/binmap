<template>
    <div class="dropdown is-hoverable">
        <div class="dropdown-trigger">
            <span class="icon is-small">
                <i class="fas fa-circle-info"></i>
            </span>
        </div>
        <div class="dropdown-menu">
            <div class="dropdown-content">
                <div class="dropdown-item is-size-7">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
