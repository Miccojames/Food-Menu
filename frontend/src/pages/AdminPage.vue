<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" to="/" />
        <q-toolbar-title>BiteBoard Admin</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row justify-between items-center q-mb-md">
          <div class="text-h5">Food Management</div>
          <q-btn color="primary" icon="add" label="Add Food" @click="openAddDialog" />
        </div>

        <q-table
          :rows="foods"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <q-img :src="props.row.image" style="width: 50px; height: 50px; border-radius: 8px;" />
            </q-td>
          </template>

          <template v-slot:body-cell-available="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.available"
                color="primary"
                @update:model-value="toggleAvailability(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="edit" @click="openEditDialog(props.row)" />
              <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-page>
    </q-page-container>

    <!-- Food Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Food' : 'Add Food' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveFood" class="q-gutter-md">
            <q-input v-model="form.name" label="Name" outlined dense required />
            
            <q-select 
              v-model="form.category" 
              :options="categoryOptions" 
              label="Category" 
              outlined 
              dense 
              required 
            />
            
            <q-input v-model.number="form.price" type="number" label="Price" outlined dense required />
            
            <q-input v-model="form.description" label="Description" outlined dense required />
            
            <q-input v-model="form.image" label="Image URL" outlined dense required />
            
            <div class="row q-gutter-sm">
              <q-toggle v-model="form.spicy" label="Spicy" />
              <q-toggle v-model="form.vegetarian" label="Vegetarian" />
              <q-toggle v-model="form.available" label="Available" />
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="grey" v-close-popup />
              <q-btn type="submit" label="Save" color="primary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { foodService } from '../services/food.service';
import { categoryService } from '../services/category.service';

const $q = useQuasar();

const foods = ref([]);
const categories = ref([]);
const categoryOptions = ref([]);
const loading = ref(false);

const dialog = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const form = ref({
  name: '',
  category: '',
  price: 0,
  description: '',
  image: '',
  spicy: false,
  vegetarian: false,
  available: true
});

const columns = [
  { name: 'image', align: 'left', label: 'Image', field: 'image' },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'category', align: 'left', label: 'Category', field: 'category', sortable: true },
  { name: 'price', align: 'left', label: 'Price (₱)', field: 'price', sortable: true },
  { name: 'available', align: 'center', label: 'Available', field: 'available' },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' }
];

const loadData = async () => {
  loading.value = true;
  try {
    const [foodsRes, catsRes] = await Promise.all([
      foodService.getFoods(),
      categoryService.getCategories()
    ]);
    foods.value = foodsRes.data;
    categories.value = catsRes.data;
    categoryOptions.value = catsRes.data.map(c => c.name);
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Failed to load data' });
  } finally {
    loading.value = false;
  }
};

const openAddDialog = () => {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    name: '',
    category: categoryOptions.value[0] || '',
    price: 0,
    description: '',
    image: '',
    spicy: false,
    vegetarian: false,
    available: true
  };
  dialog.value = true;
};

const openEditDialog = (food) => {
  isEdit.value = true;
  currentId.value = food.id;
  form.value = { ...food };
  dialog.value = true;
};

const saveFood = async () => {
  try {
    if (isEdit.value) {
      await foodService.updateFood(currentId.value, form.value);
      $q.notify({ color: 'positive', message: 'Food updated' });
    } else {
      await foodService.createFood(form.value);
      $q.notify({ color: 'positive', message: 'Food added' });
    }
    dialog.value = false;
    loadData();
  } catch (error) {
    $q.notify({ color: 'negative', message: error.message || 'Failed to save food' });
  }
};

const toggleAvailability = async (food) => {
  try {
    await foodService.updateFood(food.id, { available: food.available });
    $q.notify({ color: 'positive', message: 'Availability updated' });
  } catch (error) {
    // Revert visually on error
    food.available = !food.available;
    $q.notify({ color: 'negative', message: 'Failed to update' });
  }
};

const confirmDelete = (food) => {
  $q.dialog({
    title: 'Confirm',
    message: `Are you sure you want to delete ${food.name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await foodService.deleteFood(food.id);
      $q.notify({ color: 'positive', message: 'Food deleted' });
      loadData();
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Failed to delete' });
    }
  });
};

onMounted(() => {
  loadData();
});
</script>
