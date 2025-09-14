<template>
  <div class="delivery-address-page">
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <h2>{{ $t('deliveryAddress') || '邮寄地址' }}</h2>
      <div class="spacer"></div>
    </div>

    <!-- Prize Info -->
    <div class="prize-info">
      <div class="prize-card">
        <img :src="prize?.image || '/api/placeholder/80/80'" :alt="prize?.name" />
        <div class="prize-details">
          <h3>{{ prize?.name }}</h3>
          <div class="prize-value">{{ $t('prizeValue') || '奖品价值' }}: ¥{{ prize?.value }}</div>
        </div>
      </div>
    </div>

    <!-- Delivery Options -->
    <div class="delivery-options">
      <h3>{{ $t('deliveryMethod') || '配送方式' }}</h3>
      <div class="option-cards">
        <div 
          @click="deliveryMethod = 'express'"
          :class="['option-card', { active: deliveryMethod === 'express' }]"
        >
          <div class="option-icon">📦</div>
          <div class="option-content">
            <div class="option-title">{{ $t('expressDelivery') || '快递邮寄' }}</div>
            <div class="option-desc">{{ $t('expressDesc') || '通过快递直接邮寄到您的地址' }}</div>
          </div>
          <div class="radio-btn" :class="{ checked: deliveryMethod === 'express' }"></div>
        </div>

        <div 
          @click="deliveryMethod = 'pickup'"
          :class="['option-card', { active: deliveryMethod === 'pickup' }]"
        >
          <div class="option-icon">🏪</div>
          <div class="option-content">
            <div class="option-title">{{ $t('pickupPoint') || '自提点取货' }}</div>
            <div class="option-desc">{{ $t('pickupDesc') || '到指定自提点取货' }}</div>
          </div>
          <div class="radio-btn" :class="{ checked: deliveryMethod === 'pickup' }"></div>
        </div>
      </div>
    </div>

    <!-- Address Form (for express delivery) -->
    <div v-if="deliveryMethod === 'express'" class="address-form">
      <h3>{{ $t('shippingAddress') || '收货地址' }}</h3>
      
      <!-- Saved Addresses -->
      <div v-if="savedAddresses.length" class="saved-addresses">
        <div class="section-title">{{ $t('savedAddresses') || '保存的地址' }}</div>
        <div 
          v-for="address in savedAddresses" 
          :key="address.id"
          @click="selectAddress(address)"
          :class="['address-item', { active: selectedAddressId === address.id }]"
        >
          <div class="address-content">
            <div class="address-name">{{ address.name }} {{ address.phone }}</div>
            <div class="address-detail">{{ address.fullAddress }}</div>
          </div>
          <div class="radio-btn" :class="{ checked: selectedAddressId === address.id }"></div>
        </div>
        <button @click="showNewAddressForm = true" class="add-address-btn">
          + {{ $t('addNewAddress') || '添加新地址' }}
        </button>
      </div>

      <!-- New Address Form -->
      <div v-if="!savedAddresses.length || showNewAddressForm" class="new-address-form">
        <div class="form-group">
          <label>{{ $t('recipientName') || '收件人姓名' }}</label>
          <input 
            v-model="addressForm.name" 
            type="text" 
            :placeholder="$t('enterRecipientName') || '请输入收件人姓名'" 
          />
        </div>

        <div class="form-group">
          <label>{{ $t('phoneNumber') || '联系电话' }}</label>
          <input 
            v-model="addressForm.phone" 
            type="tel" 
            :placeholder="$t('enterPhoneNumber') || '请输入联系电话'" 
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ $t('province') || '省/直辖市' }}</label>
            <select v-model="addressForm.province" @change="onProvinceChange">
              <option value="">{{ $t('selectProvince') || '请选择省份' }}</option>
              <option v-for="province in provinces" :key="province" :value="province">
                {{ province }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ $t('city') || '市' }}</label>
            <select v-model="addressForm.city" @change="onCityChange">
              <option value="">{{ $t('selectCity') || '请选择城市' }}</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('district') || '区/县' }}</label>
          <select v-model="addressForm.district">
            <option value="">{{ $t('selectDistrict') || '请选择区县' }}</option>
            <option v-for="district in districts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ $t('detailAddress') || '详细地址' }}</label>
          <textarea 
            v-model="addressForm.detail" 
            :placeholder="$t('enterDetailAddress') || '请输入详细地址（街道、门牌号等）'" 
            rows="3"
          ></textarea>
        </div>

        <div class="form-group checkbox">
          <label class="checkbox-label">
            <input v-model="addressForm.saveAddress" type="checkbox" />
            <span class="checkmark"></span>
            {{ $t('saveThisAddress') || '保存此地址' }}
          </label>
        </div>
      </div>
    </div>

    <!-- Pickup Points (for pickup delivery) -->
    <div v-else-if="deliveryMethod === 'pickup'" class="pickup-points">
      <h3>{{ $t('selectPickupPoint') || '选择自提点' }}</h3>
      <div class="pickup-list">
        <div 
          v-for="point in pickupPoints" 
          :key="point.id"
          @click="selectedPickupId = point.id"
          :class="['pickup-item', { active: selectedPickupId === point.id }]"
        >
          <div class="pickup-content">
            <div class="pickup-name">{{ point.name }}</div>
            <div class="pickup-address">{{ point.address }}</div>
            <div class="pickup-hours">{{ $t('businessHours') || '营业时间' }}: {{ point.hours }}</div>
            <div class="pickup-phone">{{ $t('contactPhone') || '联系电话' }}: {{ point.phone }}</div>
          </div>
          <div class="radio-btn" :class="{ checked: selectedPickupId === point.id }"></div>
        </div>
      </div>
    </div>

    <!-- Special Instructions -->
    <div class="special-instructions">
      <h3>{{ $t('specialInstructions') || '特殊说明' }}</h3>
      <textarea 
        v-model="instructions" 
        :placeholder="$t('enterInstructions') || '如有特殊要求请在此说明（选填）'" 
        rows="3"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <div class="submit-section">
      <div class="delivery-summary">
        <div class="summary-item">
          <span>{{ $t('deliveryMethod') || '配送方式' }}:</span>
          <span>{{ deliveryMethod === 'express' ? $t('expressDelivery') || '快递邮寄' : $t('pickupPoint') || '自提点取货' }}</span>
        </div>
        <div v-if="deliveryMethod === 'express' && getSelectedAddress()" class="summary-item">
          <span>{{ $t('deliveryAddress') || '配送地址' }}:</span>
          <span>{{ getSelectedAddress().fullAddress }}</span>
        </div>
        <div v-if="deliveryMethod === 'pickup' && getSelectedPickup()" class="summary-item">
          <span>{{ $t('pickupLocation') || '自提地点' }}:</span>
          <span>{{ getSelectedPickup().name }}</span>
        </div>
      </div>
      
      <button @click="submitDelivery" :disabled="!canSubmit || submitting" class="submit-btn">
        {{ submitting ? $t('submitting') || '提交中...' : $t('confirmDelivery') || '确认配送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { submitDeliveryAddress } from '../api/index.js';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const prize = ref(null);
const deliveryMethod = ref('express');
const selectedAddressId = ref(null);
const selectedPickupId = ref(null);
const showNewAddressForm = ref(false);
const submitting = ref(false);
const instructions = ref('');

const addressForm = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  saveAddress: false
});

const savedAddresses = ref([]);
const pickupPoints = ref([]);

// Mock location data
const provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省'];
const cities = ref([]);
const districts = ref([]);

const canSubmit = computed(() => {
  if (deliveryMethod.value === 'express') {
    return selectedAddressId.value || (
      addressForm.value.name && 
      addressForm.value.phone && 
      addressForm.value.province && 
      addressForm.value.city && 
      addressForm.value.district && 
      addressForm.value.detail
    );
  } else {
    return selectedPickupId.value;
  }
});

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  
  await loadPrizeInfo();
  await loadSavedAddresses();
  await loadPickupPoints();
});

async function loadPrizeInfo() {
  const prizeId = route.params.prizeId;
  // Mock prize data
  prize.value = {
    id: prizeId,
    name: '苹果 iPhone 15 Pro',
    image: '/api/placeholder/80/80',
    value: 8999
  };
}

async function loadSavedAddresses() {
  // Mock saved addresses
  savedAddresses.value = [
    {
      id: 1,
      name: '张三',
      phone: '138****1234',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路123号',
      fullAddress: '北京市北京市朝阳区建国路123号'
    }
  ];
  
  if (savedAddresses.value.length > 0) {
    selectedAddressId.value = savedAddresses.value[0].id;
  }
}

async function loadPickupPoints() {
  // Mock pickup points
  pickupPoints.value = [
    {
      id: 1,
      name: '朝阳区服务中心',
      address: '北京市朝阳区建国路88号',
      hours: '09:00-18:00',
      phone: '010-12345678'
    },
    {
      id: 2,
      name: '海淀区服务中心', 
      address: '北京市海淀区中关村大街99号',
      hours: '09:00-18:00',
      phone: '010-87654321'
    }
  ];
}

function onProvinceChange() {
  // Mock cities data based on province
  cities.value = ['北京市', '天津市', '上海市'];
  addressForm.value.city = '';
  addressForm.value.district = '';
  districts.value = [];
}

function onCityChange() {
  // Mock districts data based on city
  districts.value = ['朝阳区', '海淀区', '西城区', '东城区'];
  addressForm.value.district = '';
}

function selectAddress(address) {
  selectedAddressId.value = address.id;
  showNewAddressForm.value = false;
}

function getSelectedAddress() {
  return savedAddresses.value.find(addr => addr.id === selectedAddressId.value);
}

function getSelectedPickup() {
  return pickupPoints.value.find(point => point.id === selectedPickupId.value);
}

async function submitDelivery() {
  if (!canSubmit.value) return;
  
  submitting.value = true;
  
  try {
    const deliveryData = {
      prizeId: prize.value.id,
      method: deliveryMethod.value,
      instructions: instructions.value
    };
    
    if (deliveryMethod.value === 'express') {
      if (selectedAddressId.value) {
        const address = getSelectedAddress();
        deliveryData.address = address;
      } else {
        // Create new address
        const newAddress = {
          ...addressForm.value,
          fullAddress: `${addressForm.value.province}${addressForm.value.city}${addressForm.value.district}${addressForm.value.detail}`
        };
        deliveryData.address = newAddress;
        
        if (addressForm.value.saveAddress) {
          // Save address for future use
          savedAddresses.value.push({
            id: Date.now(),
            ...newAddress
          });
        }
      }
    } else {
      deliveryData.pickupPoint = getSelectedPickup();
    }
    
    await submitDeliveryAddress(deliveryData);
    
    alert(t('deliverySubmitted') || '配送信息提交成功！我们将尽快为您安排配送。');
    router.push('/my-prizes');
    
  } catch (error) {
    alert(t('submitFailed') || '提交失败，请稍后重试');
    console.error('Failed to submit delivery:', error);
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.delivery-address-page {
  min-height: 100vh;
  padding: 0;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 50%, #bbdefb 100%);
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1976d2;
  cursor: pointer;
  padding: 5px;
  margin-right: 15px;
}

.header h2 {
  flex: 1;
  text-align: center;
  color: #1976d2;
  margin: 0;
  font-size: 1.5rem;
}

.spacer {
  width: 40px;
}

.prize-info {
  padding: 20px;
}

.prize-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.prize-card img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.prize-details h3 {
  color: #333;
  margin-bottom: 8px;
}

.prize-value {
  color: #1976d2;
  font-weight: 600;
}

.delivery-options,
.address-form,
.pickup-points,
.special-instructions {
  padding: 0 20px 20px;
}

.delivery-options h3,
.address-form h3,
.pickup-points h3,
.special-instructions h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.option-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.option-card:hover {
  border-color: #1976d2;
}

.option-card.active {
  border-color: #1976d2;
  background: #f8f9fa;
}

.option-icon {
  font-size: 2rem;
  width: 50px;
  text-align: center;
}

.option-content {
  flex: 1;
}

.option-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.option-desc {
  font-size: 0.85rem;
  color: #666;
}

.radio-btn {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-btn.checked {
  border-color: #1976d2;
}

.radio-btn.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: #1976d2;
  border-radius: 50%;
}

.address-form,
.pickup-points,
.special-instructions {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin: 0 20px 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.saved-addresses {
  margin-bottom: 25px;
}

.section-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.address-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.address-item:hover {
  border-color: #1976d2;
}

.address-item.active {
  border-color: #1976d2;
  background: #f8f9fa;
}

.address-content {
  flex: 1;
}

.address-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.address-detail {
  font-size: 0.9rem;
  color: #666;
}

.add-address-btn {
  width: 100%;
  padding: 12px;
  border: 2px dashed #1976d2;
  border-radius: 10px;
  background: transparent;
  color: #1976d2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-address-btn:hover {
  background: #f8f9fa;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group.checkbox {
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.pickup-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pickup-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pickup-item:hover {
  border-color: #1976d2;
}

.pickup-item.active {
  border-color: #1976d2;
  background: #f8f9fa;
}

.pickup-content {
  flex: 1;
}

.pickup-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.pickup-address,
.pickup-hours,
.pickup-phone {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 3px;
}

.special-instructions textarea {
  resize: vertical;
}

.submit-section {
  padding: 20px;
}

.delivery-summary {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.summary-item span:first-child {
  color: #666;
  font-weight: 500;
}

.summary-item span:last-child {
  color: #333;
  text-align: right;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0, #1976d2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .option-card,
  .address-item,
  .pickup-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>