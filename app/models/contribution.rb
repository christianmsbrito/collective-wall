class Contribution < ApplicationRecord
  belongs_to :user
  belongs_to :wall

  validates :content, presence: true, length: { maximum: 100 }
end
