<template>
  <div class="edit-profile-page">
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <h2>{{ $t('editProfile') || '编辑资料' }}</h2>
      <div class="spacer"></div>
    </div>

    <div class="profile-form">
      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img :src="profileData.avatar || '/api/placeholder/100/100'" :alt="profileData.nickname" />
          <button @click="selectAvatar" class="change-avatar-btn">
            {{ $t('changeAvatar') || '更换头像' }}
          </button>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="form-section">
        <div class="form-group">
          <label>{{ $t('nickname') }}</label>
          <input 
            v-model="profileData.nickname" 
            type="text" 
            :placeholder="$t('enterNickname') || '请输入昵称'" 
          />
        </div>

        <div class="form-group">
          <label>{{ $t('phone') || '手机号' }}</label>
          <input 
            v-model="profileData.phone" 
            type="tel" 
            :placeholder="$t('enterPhone') || '请输入手机号'" 
          />
        </div>

        <div class="form-group">
          <label>{{ $t('email') || '邮箱' }}</label>
          <input 
            v-model="profileData.email" 
            type="email" 
            :placeholder="$t('enterEmail') || '请输入邮箱'" 
          />
        </div>

        <div class="form-group">
          <label>{{ $t('realName') || '真实姓名' }}</label>
          <input 
            v-model="profileData.realName" 
            type="text" 
            :placeholder="$t('enterRealName') || '请输入真实姓名'" 
          />
        </div>

        <div class="form-group">
          <label>{{ $t('gender') || '性别' }}</label>
          <select v-model="profileData.gender">
            <option value="">{{ $t('selectGender') || '请选择性别' }}</option>
            <option value="male">{{ $t('male') || '男' }}</option>
            <option value="female">{{ $t('female') || '女' }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>{{ $t('birthday') || '生日' }}</label>
          <input 
            v-model="profileData.birthday" 
            type="date" 
          />
        </div>

        <div class="form-group">
          <label>{{ $t('address') || '地址' }}</label>
          <textarea 
            v-model="profileData.address" 
            :placeholder="$t('enterAddress') || '请输入地址'" 
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Security Section -->
      <div class="security-section">
        <h3>{{ $t('securitySettings') || '安全设置' }}</h3>
        
        <div class="security-item" @click="changePassword">
          <div class="security-icon">🔒</div>
          <div class="security-content">
            <div class="security-title">{{ $t('changePassword') || '修改密码' }}</div>
            <div class="security-desc">{{ $t('passwordDesc') || '定期修改密码保护账户安全' }}</div>
          </div>
          <div class="security-arrow">></div>
        </div>

        <div class="security-item" @click="bindPhone">
          <div class="security-icon">📱</div>
          <div class="security-content">
            <div class="security-title">{{ $t('bindPhone') || '绑定手机' }}</div>
            <div class="security-desc">{{ profileData.phone ? $t('phoneVerified') || '已验证' : $t('phoneNotBound') || '未绑定' }}</div>
          </div>
          <div class="security-arrow">></div>
        </div>

        <div class="security-item" @click="bindEmail">
          <div class="security-icon">📧</div>
          <div class="security-content">
            <div class="security-title">{{ $t('bindEmail') || '绑定邮箱' }}</div>
            <div class="security-desc">{{ profileData.email ? $t('emailVerified') || '已验证' : $t('emailNotBound') || '未绑定' }}</div>
          </div>
          <div class="security-arrow">></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="saveProfile" :disabled="saving" class="save-btn">
          {{ saving ? $t('saving') || '保存中...' : $t('saveProfile') || '保存资料' }}
        </button>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <div v-if="showAvatarModal" class="modal-overlay" @click="showAvatarModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('selectAvatar') || '选择头像' }}</h3>
          <button @click="showAvatarModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="avatar-options">
            <input 
              ref="avatarInput" 
              type="file" 
              accept="image/*" 
              @change="handleAvatarChange" 
              style="display: none"
            />
            <button @click="$refs.avatarInput.click()" class="avatar-option upload">
              <div class="option-icon">📁</div>
              <div class="option-text">{{ $t('uploadImage') || '上传图片' }}</div>
            </button>
            <div 
              v-for="avatar in defaultAvatars" 
              :key="avatar"
              @click="selectDefaultAvatar(avatar)"
              class="avatar-option"
            >
              <img :src="avatar" :alt="'Avatar'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProfile, updateProfile } from '../api/index.js';

const router = useRouter();
const { t } = useI18n();

const profileData = ref({
  nickname: '',
  phone: '',
  email: '',
  realName: '',
  gender: '',
  birthday: '',
  address: '',
  avatar: ''
});

const saving = ref(false);
const showAvatarModal = ref(false);
const avatarInput = ref(null);

const defaultAvatars = [
  '/api/placeholder/100/100',
  '/api/placeholder/100/100',
  '/api/placeholder/100/100',
  '/api/placeholder/100/100'
];

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  await loadProfile();
});

async function loadProfile() {
  try {
    const res = await getProfile();
    Object.assign(profileData.value, res.data || {});
  } catch (error) {
    console.error('Failed to load profile:', error);
    // Mock data for demo
    profileData.value = {
      nickname: 'Demo用户',
      phone: '138****1234',
      email: 'demo@example.com',
      realName: '张三',
      gender: 'male',
      birthday: '1990-01-01',
      address: '北京市朝阳区',
      avatar: '/api/placeholder/100/100'
    };
  }
}

async function saveProfile() {
  saving.value = true;
  try {
    await updateProfile(profileData.value);
    alert(t('saveSuccess') || '保存成功');
    router.back();
  } catch (error) {
    alert(t('saveFailed') || '保存失败，请稍后重试');
    console.error('Failed to save profile:', error);
  } finally {
    saving.value = false;
  }
}

function selectAvatar() {
  showAvatarModal.value = true;
}

function selectDefaultAvatar(avatar) {
  profileData.value.avatar = avatar;
  showAvatarModal.value = false;
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileData.value.avatar = e.target.result;
      showAvatarModal.value = false;
    };
    reader.readAsDataURL(file);
  }
}

function changePassword() {
  // Navigate to change password page or show modal
  alert(t('featureComingSoon') || '功能即将上线');
}

function bindPhone() {
  // Navigate to phone binding page or show modal
  alert(t('featureComingSoon') || '功能即将上线');
}

function bindEmail() {
  // Navigate to email binding page or show modal
  alert(t('featureComingSoon') || '功能即将上线');
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.edit-profile-page {
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

.profile-form {
  padding: 20px;
}

.avatar-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.avatar-wrapper img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid #e3f2fd;
}

.change-avatar-btn {
  padding: 8px 20px;
  border: 1px solid #1976d2;
  border-radius: 20px;
  background: transparent;
  color: #1976d2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: #1976d2;
  color: white;
}

.form-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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

.security-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.security-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.security-item:hover {
  background: #f8f9fa;
}

.security-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.security-content {
  flex: 1;
}

.security-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.security-desc {
  font-size: 0.85rem;
  color: #666;
}

.security-arrow {
  font-size: 1.2rem;
  color: #ccc;
}

.action-buttons {
  text-align: center;
}

.save-btn {
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

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0, #1976d2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 25px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  line-height: 1;
}

.avatar-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.avatar-option {
  aspect-ratio: 1;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.avatar-option:hover {
  border-color: #1976d2;
}

.avatar-option.upload {
  background: #f8f9fa;
}

.avatar-option img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.option-icon {
  font-size: 2rem;
  margin-bottom: 5px;
}

.option-text {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}

@media (max-width: 768px) {
  .profile-form {
    padding: 15px;
  }
  
  .avatar-options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>