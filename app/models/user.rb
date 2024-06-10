class User < ApplicationRecord
    has_many :owned_walls, class_name: 'Wall', foreign_key: 'owner_id'
    has_many :contributions, dependent: :destroy
    has_many :walls

    has_secure_password :password, validations: true

    validates :name, presence: true, uniqueness: true

    def self.get_or_create(name)
        find_or_create_by(name: name)
    end
end
