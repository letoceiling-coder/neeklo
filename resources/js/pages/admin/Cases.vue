<template>
    <div class="cases-page">
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-foreground">Кейсы</h1>
                    <p class="text-muted-foreground mt-1">Управление кейсами портфолио</p>
                </div>
                <button
                    @click="showAddForm = true"
                    class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Добавить кейс
                </button>
            </div>
        </div>

        <!-- Форма добавления -->
        <div v-if="showAddForm" class="mb-6 p-4 rounded-lg bg-card border border-border">
            <h3 class="text-lg font-semibold mb-4">Новый кейс</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Slug (латиница, дефисы)</label>
                    <input
                        v-model="newCase.slug"
                        type="text"
                        placeholder="example-case"
                        class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Название</label>
                    <input
                        v-model="newCase.title"
                        type="text"
                        placeholder="Название кейса"
                        class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                    />
                </div>
                <div class="flex gap-3">
                    <button
                        @click="handleCreate"
                        :disabled="creating || !newCase.slug || !newCase.title"
                        class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {{ creating ? 'Создание...' : 'Создать' }}
                    </button>
                    <button
                        @click="cancelAdd"
                        class="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            {{ error }}
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="text-center py-8 text-muted-foreground">
            Загрузка кейсов...
        </div>

        <!-- Пустое состояние -->
        <div v-else-if="cases.length === 0 && !showAddForm" class="text-center py-8 text-muted-foreground">
            Нет кейсов. Создайте первый кейс.
        </div>

        <!-- Список кейсов -->
        <div v-else class="space-y-3">
            <div
                v-for="caseItem in cases"
                :key="caseItem.id"
                @click="goToCase(caseItem.id)"
                class="p-4 rounded-lg bg-card border border-border hover:border-primary/50 cursor-pointer transition-all"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-sm text-muted-foreground">{{ caseItem.slug }}</span>
                                <span class="font-semibold text-foreground">{{ caseItem.title }}</span>
                            </div>
                            <div v-if="caseItem.category" class="mt-1">
                                <span class="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                    {{ caseItem.category }}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg
                                v-if="caseItem.cover"
                                class="w-4 h-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <svg
                                v-if="caseItem.video"
                                class="w-4 h-4 text-violet-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Cases',
    data() {
        return {
            cases: [],
            loading: true,
            error: null,
            showAddForm: false,
            creating: false,
            newCase: {
                slug: '',
                title: '',
            },
        };
    },
    mounted() {
        this.fetchCases();
    },
    methods: {
        async fetchCases() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('/api/cases');
                this.cases = response.data.data || [];
            } catch (error) {
                console.error('Error fetching cases:', error);
                this.error = 'Ошибка загрузки кейсов';
            } finally {
                this.loading = false;
            }
        },
        async handleCreate() {
            if (!this.newCase.slug.trim() || !this.newCase.title.trim()) {
                return;
            }
            this.creating = true;
            this.error = null;
            try {
                const response = await axios.post('/api/v1/cases', {
                    slug: this.newCase.slug.trim(),
                    title: this.newCase.title.trim(),
                });
                if (response.data.success && response.data.data) {
                    this.cancelAdd();
                    this.fetchCases();
                    // Переход на страницу редактирования через React роутинг
                    window.location.href = `/admin/cases/${response.data.data.id}`;
                } else {
                    this.error = response.data.message || 'Ошибка создания кейса';
                }
            } catch (error) {
                console.error('Error creating case:', error);
                this.error = error.response?.data?.message || 'Ошибка создания кейса';
            } finally {
                this.creating = false;
            }
        },
        cancelAdd() {
            this.showAddForm = false;
            this.newCase = { slug: '', title: '' };
            this.error = null;
        },
        goToCase(id) {
            // Переход на страницу редактирования через React роутинг
            window.location.href = `/admin/cases/${id}`;
        },
    },
};
</script>

<style scoped>
.cases-page {
    min-height: 100vh;
}
</style>
